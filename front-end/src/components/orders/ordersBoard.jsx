import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BadgeDollarSign,
  ClipboardList,
  Download,
  PackageCheck,
  Pill,
  ReceiptText,
  Store,
  Truck,
  UserRound,
} from "lucide-react";
import {
  cancelOrder,
  updateOrderStatus,
} from "../../redux/orderThunk/orderThunk";

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-sky-100 text-sky-700",
  Shipped: "bg-indigo-100 text-indigo-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-rose-100 text-rose-700",
};

function OrdersBoard({
  title,
  subtitle,
  fetchOrders,
  emptyMessage,
  highlightLabel,
  showCustomer = false,
  allowCancel = false,
  allowStatusUpdate = false,
  allowPdfExport = false,
}) {
  const dispatch = useDispatch();
  const { orders, ordersLoading, loading, error, message } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch, fetchOrders]);

  const summary = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        const itemCount = order?.items?.length || 0;
        acc.totalOrders += 1;
        acc.totalItems += itemCount;
        acc.totalAmount += Number(order?.totalAmount || 0);
        return acc;
      },
      { totalOrders: 0, totalItems: 0, totalAmount: 0 }
    );
  }, [orders]);

  const escapePdfText = (text) =>
    String(text ?? "")
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");

  const createPdfBlob = (lines) => {
    const pageHeight = 842;
    const top = 800;
    const lineHeight = 18;
    const linesPerPage = 40;
    const pagedLines = [];

    for (let index = 0; index < lines.length; index += linesPerPage) {
      pagedLines.push(lines.slice(index, index + linesPerPage));
    }

    const objects = [];
    objects.push("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj");

    const pageObjectIds = pagedLines.map((_, index) => 3 + index * 2);
    const contentObjectIds = pagedLines.map((_, index) => 4 + index * 2);

    objects.push(
      `2 0 obj << /Type /Pages /Kids [${pageObjectIds
        .map((id) => `${id} 0 R`)
        .join(" ")}] /Count ${pageObjectIds.length} >> endobj`
    );

    pagedLines.forEach((pageLines, index) => {
      const pageId = pageObjectIds[index];
      const contentId = contentObjectIds[index];
      const textCommands = pageLines
        .map((line, lineIndex) => {
          const y = top - lineIndex * lineHeight;
          return `BT /F1 11 Tf 40 ${y} Td (${escapePdfText(line)}) Tj ET`;
        })
        .join("\n");

      const contentStream = `${textCommands}\n`;

      objects.push(
        `${pageId} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 ${pageHeight}] /Resources << /Font << /F1 ${3 +
          pagedLines.length * 2} 0 R >> >> /Contents ${contentId} 0 R >> endobj`
      );
      objects.push(
        `${contentId} 0 obj << /Length ${contentStream.length} >> stream\n${contentStream}endstream\nendobj`
      );
    });

    const fontObjectId = 3 + pagedLines.length * 2;
    objects.push(
      `${fontObjectId} 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj`
    );

    let pdf = "%PDF-1.4\n";
    const offsets = [0];

    objects.forEach((object) => {
      offsets.push(pdf.length);
      pdf += `${object}\n`;
    });

    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += "0000000000 65535 f \n";
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    });
    pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

    return new Blob([pdf], { type: "application/pdf" });
  };

  const downloadPdf = (fileName, lines) => {
    const blob = createPdfBlob(lines);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const downloadSingleOrderPdf = (order) => {
    const itemLines = (order?.items || [])
      .map(
        (item) =>
          `${item?.medicineId?.name || "Medicine"} | Qty: ${item?.quantity || 0} | Total: $${(
            Number(item?.price || 0) * Number(item?.quantity || 0)
          ).toFixed(2)}`
      )
      .flat();

    downloadPdf(
      `order-${order?._id?.slice(-6)?.toUpperCase()}.pdf`,
      [
        "Pharmacy Order Report",
        `Order #${order?._id?.slice(-6)?.toUpperCase()}`,
        `Status: ${order?.orderStatus || "Pending"}`,
        `Customer: ${order?.customerInfo?.fullName || "Customer"}`,
        `Order Date: ${new Date(order?.createdAt || order?.orderDate).toLocaleString()}`,
        `Total Amount: $${Number(order?.totalAmount || 0).toFixed(2)}`,
        `Delivery Address: ${order?.deliveryAddress?.addressLine1 || ""} ${order?.deliveryAddress?.addressLine2 || ""}`,
        `${order?.deliveryAddress?.city || ""}, ${order?.deliveryAddress?.postalCode || ""}`,
        "",
        "Items",
        ...itemLines,
      ]
    );
  };

  const downloadAllOrdersPdf = () => {
    const lines = [
      "Pharmacy Orders Summary",
      `Orders: ${summary.totalOrders}`,
      `Products: ${summary.totalItems}`,
      `Value: $${summary.totalAmount.toFixed(2)}`,
      "",
    ];

    orders.forEach((order) => {
      lines.push(`Order #${order?._id?.slice(-6)?.toUpperCase()}`);
      lines.push(`Customer: ${order?.customerInfo?.fullName || "Customer"}`);
      lines.push(`Status: ${order?.orderStatus || "Pending"}`);
      lines.push(`Total: $${Number(order?.totalAmount || 0).toFixed(2)}`);
      (order?.items || [])
        .map(
          (item) =>
            `- ${item?.medicineId?.name || "Medicine"} | Qty: ${item?.quantity || 0} | $${(
              Number(item?.price || 0) * Number(item?.quantity || 0)
            ).toFixed(2)}`
        )
        .forEach((line) => lines.push(line));
      lines.push("");
    });

    downloadPdf(
      "pharmacy-orders-summary.pdf",
      lines
    );
  };

  if (ordersLoading) {
    return <div className="py-20 text-center text-lg text-slate-600">Loading orders...</div>;
  }

  return (
    <div className="space-y-5 font-clinic-body">
      <section className="rounded-[28px] border border-white/60 bg-white/85 p-4 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
              <ReceiptText size={14} />
              {highlightLabel}
            </span>
            <div>
              <h1 className="font-clinic-heading text-[26px] font-semibold text-slate-900 sm:text-[30px]">
                {title}
              </h1>
              <p className="mt-1 max-w-2xl text-[12px] leading-5 text-slate-500 sm:text-[13px]">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Orders</p>
              <p className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">{summary.totalOrders}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Products</p>
              <p className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">{summary.totalItems}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Value</p>
              <p className="mt-1 text-xl font-semibold text-emerald-600 sm:text-2xl">${summary.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {allowPdfExport && orders.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadAllOrdersPdf}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
            >
              <Download size={14} />
              Download All Orders PDF
            </button>
          </div>
        )}
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-[13px] text-rose-700 shadow-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700 shadow-sm">
          {message}
        </div>
      )}

      {orders.length === 0 ? (
        <section className="rounded-[32px] border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center text-slate-500 shadow-sm">
          {emptyMessage}
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {orders.map((order) => {
            const customerName = order?.customerInfo?.fullName || order?.patientId?.name || "Customer";
            const customerPhone = order?.customerInfo?.phone || order?.patientId?.phone || "Phone not available";
            const address = order?.deliveryAddress;
            const visibleItems = (order?.items || []).slice(0, 2);
            const extraItemsCount = Math.max((order?.items || []).length - visibleItems.length, 0);
            const canCancelOrder =
              allowCancel &&
              order?.orderStatus !== "Delivered" &&
              order?.orderStatus !== "Cancelled";

            const handleStatusChange = async (orderStatus) => {
              try {
                await dispatch(
                  updateOrderStatus({ orderId: order._id, orderStatus })
                ).unwrap();
                dispatch(fetchOrders());
              } catch (mutationError) {
                return mutationError;
              }
            };

            const handleCancelOrder = async () => {
              try {
                await dispatch(cancelOrder(order._id)).unwrap();
                dispatch(fetchOrders());
              } catch (mutationError) {
                return mutationError;
              }
            };

            return (
              <article
                key={order._id}
                className="rounded-[26px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/35"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[17px] font-semibold text-slate-900">
                        Order #{order?._id?.slice(-6)?.toUpperCase()}
                        </h2>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                            statusStyles[order?.orderStatus] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {order?.orderStatus || "Pending"}
                        </span>
                      </div>
                      <p className="mt-2 text-[12px] text-slate-500">
                        {new Date(order?.createdAt || order?.orderDate).toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-600">Total</p>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-[15px] font-semibold text-emerald-700">
                        <BadgeDollarSign size={14} />
                        ${Number(order?.totalAmount || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 px-3 py-3">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Delivery</p>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-800">
                        <Truck size={12} className="text-sky-700" />
                        {order?.deliveryType === "pickup" ? "Pickup" : "Home"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 px-3 py-3">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Payment</p>
                      <p className="mt-1 text-[12px] font-semibold capitalize text-slate-800">
                        {order?.paymentMethod || "cash"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 px-3 py-3">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Items</p>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-800">
                        <PackageCheck size={12} className="text-teal-600" />
                        {(order?.items || []).length} lines
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_250px]">
                    <div className="space-y-2">
                      {visibleItems.map((item) => (
                        <div
                          key={item?._id || item?.medicineId?._id}
                          className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-semibold text-slate-900">
                                {item?.medicineId?.name || "Medicine"}
                              </p>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                                <span className="inline-flex items-center gap-1">
                                  <Pill size={11} className="text-teal-600" />
                                  {item?.quantity}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Store size={11} className="text-sky-700" />
                                  {item?.medicineId?.pharmacyName || "Pharmacy"}
                                </span>
                              </div>
                            </div>
                            <p className="text-[13px] font-semibold text-slate-900">
                              ${(Number(item?.price || 0) * Number(item?.quantity || 0)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}

                      {extraItemsCount > 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-[12px] text-slate-500">
                          +{extraItemsCount} more item{extraItemsCount > 1 ? "s" : ""}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {allowPdfExport && (
                        <button
                          type="button"
                          onClick={() => downloadSingleOrderPdf(order)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                        >
                          Download PDF
                        </button>
                      )}

                      {(showCustomer || address?.addressLine1) && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                          {showCustomer && (
                            <>
                              <p className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-900">
                                <UserRound size={13} className="text-sky-700" />
                                {customerName}
                              </p>
                              <p className="mt-1 text-[11px] text-slate-500">{customerPhone}</p>
                            </>
                          )}
                          <p className="mt-2 text-[11px] leading-5 text-slate-500">
                            {address?.addressLine1}
                            {address?.addressLine2 ? `, ${address.addressLine2}` : ""}
                            {address?.city ? `, ${address.city}` : ""}
                            {address?.postalCode ? `, ${address.postalCode}` : ""}
                          </p>
                        </div>
                      )}

                      {(allowStatusUpdate || allowCancel) && (
                        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Actions
                          </p>

                          {allowStatusUpdate &&
                            order?.orderStatus !== "Cancelled" &&
                            order?.orderStatus !== "Delivered" && (
                            <div className="mt-2 grid grid-cols-1 gap-2">
                              {["Processing", "Shipped", "Delivered"].map((status) => (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => handleStatusChange(status)}
                                  disabled={loading || order?.orderStatus === status}
                                  className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          )}

                          {canCancelOrder && (
                            <button
                              type="button"
                              onClick={handleCancelOrder}
                              disabled={loading}
                              className="mt-2 w-full rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                            >
                              Cancel Order
                            </button>
                          )}

                          {!canCancelOrder && allowCancel && (
                            <p className="mt-2 text-[11px] leading-5 text-slate-500">
                              Delivered/cancelled orders cannot be cancelled.
                            </p>
                          )}

                          {allowStatusUpdate && order?.orderStatus === "Delivered" && (
                            <p className="mt-2 text-[11px] leading-5 text-slate-500">
                              Delivered orders are final and cannot be updated.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

export default OrdersBoard;
