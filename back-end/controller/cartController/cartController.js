import Cart from "../../model/cartModel/cartModel.js";
import Medicine from "../../model/medicineModel/medicineModel.js";

const getPopulatedCart = async (patientId) => {
  return Cart.findOne({ patientId }).populate("items.medicineId");
};

const getMedicineStock = async (medicineId) => {
  return Medicine.findById(medicineId).select("stock name");
};

export const addToCart = async (req, res) => {
  try {
    const patientId = req.user;
    const { medicineId, quantity } = req.body;
    const normalizedQuantity = Number(quantity);

    if (!patientId || !medicineId || !normalizedQuantity || normalizedQuantity < 1) {
      return res.status(400).json({
        message: "Patient ID, Medicine ID, and quantity are required",
      });
    }

    const medicine = await getMedicineStock(medicineId);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    if (medicine.stock <= 0) {
      return res.status(400).json({ message: "Item is out of stock" });
    }

    let cart = await Cart.findOne({ patientId });

    if (!cart) {
      cart = new Cart({ patientId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.medicineId.toString() === medicineId
    );

    if (existingItemIndex >= 0) {
      const updatedQuantity =
        cart.items[existingItemIndex].quantity + normalizedQuantity;

      if (updatedQuantity > medicine.stock) {
        return res.status(400).json({ message: "Item is out of stock" });
      }

      cart.items[existingItemIndex].quantity = updatedQuantity;
    } else {
      if (normalizedQuantity > medicine.stock) {
        return res.status(400).json({ message: "Item is out of stock" });
      }

      cart.items.push({ medicineId, quantity: normalizedQuantity });
    }

    await cart.save();
    const populatedCart = await getPopulatedCart(patientId);

    res.status(200).json({ message: "Item added to cart", cart: populatedCart });
  } catch (error) {
    res.status(500).json({
      message: "Error adding item to cart",
      error: error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const patientId = req.user;
    const cart = await getPopulatedCart(patientId);

    if (!cart) {
      return res.status(200).json({
        message: "Cart fetched successfully",
        cart: { patientId, items: [] },
      });
    }

    res.status(200).json({
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching cart",
      error: error.message,
    });
  }
};

const increaseCartItemQuantity = async (req, res) => {
  try {
    const patientId = req.user;
    const medicineId = req.params.cartItemId || req.body.medicineId;

    const cart = await Cart.findOne({ patientId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.medicineId.toString() === medicineId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const medicine = await getMedicineStock(medicineId);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    if (medicine.stock <= 0 || cart.items[itemIndex].quantity + 1 > medicine.stock) {
      return res.status(400).json({ message: "Item is out of stock" });
    }

    cart.items[itemIndex].quantity += 1;
    await cart.save();
    const populatedCart = await getPopulatedCart(patientId);

    res.status(200).json({
      message: "Item quantity increased",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error increasing item quantity",
      error: error.message,
    });
  }
};

const decreaseCartItemQuantity = async (req, res) => {
  try {
    const patientId = req.user;
    const medicineId = req.params.cartItemId || req.body.medicineId;

    const cart = await Cart.findOne({ patientId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.medicineId.toString() === medicineId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    let message = "Item quantity decreased";

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
      message = "Item removed from cart";
    }

    await cart.save();
    const populatedCart = await getPopulatedCart(patientId);

    res.status(200).json({
      message,
      cart: populatedCart || { patientId, items: [] },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error decreasing item quantity",
      error: error.message,
    });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const patientId = req.user;
    const medicineId =
      req.params.cartItemId || req.params.medicineId || req.body.medicineId;

    const cart = await Cart.findOne({ patientId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.medicineId.toString() === medicineId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    const populatedCart = await getPopulatedCart(patientId);

    res.status(200).json({
      message: "Item removed from cart",
      cart: populatedCart || { patientId, items: [] },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error removing item from cart",
      error: error.message,
    });
  }
}

const clearMyCart = async (req, res) => {
  try {
    const patientId = req.user;
    
    const cart = await Cart.findOne({ patientId });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.items = [];
    await cart.save();
    
    res.status(200).json({
      message: "Cart cleared successfully",
      cart: { patientId, items: [] },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error clearing cart",
      error: error.message,
    });
  }
};

const cartController = {
  addToCart,
  getCart,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
  removeItemFromCart,
  clearMyCart,
};

export default cartController;
