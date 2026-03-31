import OrdersBoard from "./ordersBoard";
import { getMyOrders } from "../../redux/orderThunk/orderThunk";

function MyOrders() {
  return (
    <OrdersBoard
      title="My Orders"
      subtitle="Review the medicines you have ordered, delivery details, and the current order status."
      fetchOrders={getMyOrders}
      emptyMessage="You have not placed any orders yet."
      highlightLabel="Patient Orders"
      allowCancel
    />
  );
}

export default MyOrders;
