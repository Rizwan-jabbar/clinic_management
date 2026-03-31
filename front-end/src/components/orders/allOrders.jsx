import OrdersBoard from "./ordersBoard";
import { getAllOrders } from "../../redux/orderThunk/orderThunk";

function AllOrders() {
  return (
    <OrdersBoard
      title="All Orders"
      subtitle="Admin overview of every order placed across the full clinic and pharmacy workspace."
      fetchOrders={getAllOrders}
      emptyMessage="No orders are available right now."
      highlightLabel="Admin Orders"
      showCustomer
    />
  );
}

export default AllOrders;
