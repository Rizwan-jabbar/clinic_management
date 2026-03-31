import OrdersBoard from "./ordersBoard";
import { getPharmacyOrders } from "../../redux/orderThunk/orderThunk";

function PharmacyOrders() {
  return (
    <OrdersBoard
      title="Pharmacy Orders"
      subtitle="See only those orders that include medicines added by your pharmacy."
      fetchOrders={getPharmacyOrders}
      emptyMessage="No one has ordered your pharmacy products yet."
      highlightLabel="Pharmacy Sales"
      showCustomer
      allowStatusUpdate
      allowPdfExport
    />
  );
}

export default PharmacyOrders;
