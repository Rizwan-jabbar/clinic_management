import { useSelector } from "react-redux";
import AdminDashboard from "./adminDashboard";
import AssistantDashboard from "./assistantDashboard";
import DoctorDashboard from "./doctorDashboard";
import PharmacyDashboard from "./pharmacyDashboard";
import UserDashboard from "./userDashboard";

function DashboardRouter() {
  const { user } = useSelector((state) => state.user);
  const role = user?.role?.toLowerCase() || "";

  if (role === "admin") return <AdminDashboard />;
  if (role === "pharmacy") return <PharmacyDashboard />;
  if (role === "assistant") return <AssistantDashboard />;
  if (role === "doctor") return <DoctorDashboard />;
  return <UserDashboard />;
}

export default DashboardRouter;
