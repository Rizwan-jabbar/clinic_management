import Order from "../../model/orderModel/orderModel.js";
import Cart from "../../model/cartModel/cartModel.js";
import Medicine from "../../model/medicineModel/medicineModel.js";

const populateOrderDetails = (query) =>
  query
    .populate("patientId", "name email phone")
    .populate("items.medicineId");

const allowedStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];
const allowedPharmacyStatuses = ["Processing", "Shipped", "Delivered"];

const allowedDeliveryTypes = ["home", "pickup"];
const allowedPaymentMethods = ["cash", "card"];

const pharmacyHasOrderItems = (order, pharmacyId) => {
  const items = order?.items || [];

  if (items.length === 0) {
    return false;
  }

  return items.some(
    (item) => item?.medicineId?.addedBy?.toString() === pharmacyId.toString()
  );
};

const mapOrderForPharmacy = (order, pharmacyId) => {
  if (!pharmacyHasOrderItems(order, pharmacyId)) {
    return null;
  }

  const plainOrder = order.toObject();
  const pharmacyItems = (plainOrder.items || []).filter(
    (item) => item?.medicineId?.addedBy?.toString() === pharmacyId.toString()
  );

  const pharmacyTotalAmount = pharmacyItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );

  return {
    ...plainOrder,
    items: pharmacyItems,
    totalAmount: Number(pharmacyTotalAmount.toFixed(2)),
  };
};

const createOrder = async (req, res) => {
  const updatedStockItems = [];

  try {
    const patientId = req.user;
    const {
      items,
      totalAmount,
      orderStatus,
      orderDate,
      customerInfo,
      deliveryAddress,
      deliveryType,
      paymentMethod,
    } = req.body;

    if (!patientId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one order item is required",
      });
    }

    const normalizedCustomerInfo = {
      fullName: customerInfo?.fullName?.trim(),
      phone: customerInfo?.phone?.trim(),
      email: customerInfo?.email?.trim()?.toLowerCase(),
    };

    const normalizedDeliveryAddress = {
      city: deliveryAddress?.city?.trim(),
      addressLine1: deliveryAddress?.addressLine1?.trim(),
      addressLine2: deliveryAddress?.addressLine2?.trim() || "",
      postalCode: deliveryAddress?.postalCode?.trim(),
      notes: deliveryAddress?.notes?.trim() || "",
    };

    if (
      !normalizedCustomerInfo.fullName ||
      !normalizedCustomerInfo.phone ||
      !normalizedCustomerInfo.email
    ) {
      return res.status(400).json({
        success: false,
        message: "Full name, phone, and email are required",
      });
    }

    if (
      !normalizedDeliveryAddress.city ||
      !normalizedDeliveryAddress.addressLine1 ||
      !normalizedDeliveryAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Delivery city, address, and postal code are required",
      });
    }

    if (!allowedDeliveryTypes.includes(deliveryType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery type",
      });
    }

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const normalizedItems = items.map((item) => ({
      medicineId: item?.medicineId,
      quantity: Number(item?.quantity),
    }));

    const invalidItem = normalizedItems.find(
      (item) =>
        !item.medicineId ||
        !Number.isFinite(item.quantity) ||
        item.quantity < 1
    );

    if (invalidItem) {
      return res.status(400).json({
        success: false,
        message: "Each order item must include valid medicineId and quantity",
      });
    }

    const medicineIds = [...new Set(normalizedItems.map((item) => item.medicineId.toString()))];
    const medicines = await Medicine.find({ _id: { $in: medicineIds } });
    const medicineMap = new Map(
      medicines.map((medicine) => [medicine._id.toString(), medicine])
    );

    const stockIssue = normalizedItems.find((item) => {
      const medicine = medicineMap.get(item.medicineId.toString());
      return !medicine || medicine.stock < item.quantity;
    });

    if (stockIssue) {
      return res.status(400).json({
        success: false,
        message: "One or more medicines are out of stock",
      });
    }

    const calculatedTotal = normalizedItems.reduce(
      (sum, item) => {
        const medicine = medicineMap.get(item.medicineId.toString());
        return sum + item.quantity * Number(medicine?.sellingPrice ?? medicine?.price ?? 0);
      },
      0
    );

    const normalizedTotalAmount = Number(totalAmount);

    if (
      !Number.isFinite(normalizedTotalAmount) ||
      normalizedTotalAmount < 0 ||
      Math.abs(normalizedTotalAmount - calculatedTotal) > 0.01
    ) {
      return res.status(400).json({
        success: false,
        message: "Total amount is invalid",
      });
    }

    if (orderStatus && !allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const orderPayload = {
      patientId,
      items: normalizedItems.map((item) => {
        const medicine = medicineMap.get(item.medicineId.toString());

        return {
          medicineId: item.medicineId,
          quantity: item.quantity,
          price: Number(medicine.sellingPrice ?? medicine.price ?? 0),
        };
      }),
      totalAmount: Number(calculatedTotal.toFixed(2)),
      customerInfo: normalizedCustomerInfo,
      deliveryAddress: normalizedDeliveryAddress,
      deliveryType,
      paymentMethod,
    };

    if (orderStatus) {
      orderPayload.orderStatus = orderStatus;
    }

    if (orderDate) {
      const parsedOrderDate = new Date(orderDate);

      if (Number.isNaN(parsedOrderDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid order date",
        });
      }

      orderPayload.orderDate = parsedOrderDate;
    }

    for (const item of normalizedItems) {
      const updatedMedicine = await Medicine.findOneAndUpdate(
        {
          _id: item.medicineId,
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        },
        { new: true }
      );

      if (!updatedMedicine) {
        throw new Error("Unable to update stock for one or more medicines");
      }

      updatedStockItems.push({
        medicineId: item.medicineId,
        quantity: item.quantity,
      });
    }

    const order = await Order.create(orderPayload);
    await Cart.findOneAndUpdate(
      { patientId },
      { $set: { items: [] } },
      { new: true }
    );
    const populatedOrder = await populateOrderDetails(
      Order.findById(order._id)
    );

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    if (updatedStockItems.length > 0) {
      for (const item of updatedStockItems) {
        await Medicine.findByIdAndUpdate(item.medicineId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    const statusCode =
      error.message === "Unable to update stock for one or more medicines"
        ? 400
        : 500;

    return res.status(statusCode).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const patientId = req.user;

    const orders = await populateOrderDetails(
      Order.find({ patientId }).sort({ createdAt: -1 })
    );

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching your orders",
      error: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await populateOrderDetails(
      Order.find().sort({ createdAt: -1 })
    );

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

const getPharmacyOrders = async (req, res) => {
  try {
    const pharmacyId = req.user;

    const orders = await populateOrderDetails(
      Order.find().sort({ createdAt: -1 })
    );

    const filteredOrders = orders
      .map((order) => mapOrderForPharmacy(order, pharmacyId))
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      count: filteredOrders.length,
      orders: filteredOrders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching pharmacy orders",
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await populateOrderDetails(Order.findById(orderId));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const pharmacyId = req.user;
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    if (!allowedPharmacyStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Pharmacy can only set Processing, Shipped, or Delivered status",
      });
    }

    const order = await populateOrderDetails(Order.findById(orderId));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const pharmacyOwnsItem = pharmacyHasOrderItems(order, pharmacyId);

    if (!pharmacyOwnsItem) {
      return res.status(403).json({
        success: false,
        message: "You can only update orders containing your pharmacy medicines",
      });
    }

    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled order status cannot be updated",
      });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered order status cannot be updated",
      });
    }

    order.orderStatus = orderStatus;
    await order.save();

    const updatedOrder = await populateOrderDetails(Order.findById(orderId));

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const patientId = req.user;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered order cannot be cancelled",
      });
    }

    if (order.patientId.toString() !== patientId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own orders",
      });
    }

    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    const updatedOrder = await populateOrderDetails(Order.findById(order._id));

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
};

const orderController = {
  createOrder,
  getMyOrders,
  getPharmacyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};

export default orderController;
