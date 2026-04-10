import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/layout";
import ClinicsPage from "./pages/clinicPage/clinicPage";
import DoctorsPage from "./pages/doctorPage/doctorPage";
import AddClinic from "./components/clinics/addClinic";
import ClinicDetails from "./components/clinics/clinicDetails";
import AddDoctor from "./components/doctors/addDoctor";
import DoctorDetails from "./components/doctors/doctorDetails";
import Login from "./components/login/login";
import Profile from "./components/profile/profile";
import Appointments from "./components/appointments/appointments";
import Messages from "./components/messages/messages";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "./redux/userThunk/userThunk";
import { useEffect } from "react";
import MyPatient from "./components/myPatient/myPatient";
import PatientDetails from "./components/myPatient/patientDetails";
import MyMedicalHistory from "./components/myMedicalHistory/myMedicalHistory";
import MyAssistant from "./components/assistant/myAssistant/myAssistant";
import AddAssistant from "./components/assistant/addAssistant/addAssistant";
import AppointmentRequest from "./components/appointmentRequest/appointmentRequest";
import MyAppointmnetRequest from "./components/myAppointmentRequest/myAppointmentRequest";
import AddPharmacy from "./components/pharmacy/addPharmacy/addPharmacy";
import Register from "./components/register/register";
import AddMedicine from "./components/medicine/addMedicine";
import MedicineList from "./components/medicine/medicineList";
import PharmacyList from "./components/pharmacy/pharmacyList/pharmacyList";
import PharmacyDetails from "./components/pharmacy/pharmacyDetails/pharmacyDetails";
import AllMedicine from "./components/medicine/allMedicine";
import MyCart from "./components/myCart/myCart";
import MyCheckOut from "./components/myCheckOut/myCheckOut";
import MyOrders from "./components/orders/myOrders";
import PharmacyOrders from "./components/orders/pharmacyOrders";
import AllOrders from "./components/orders/allOrders";
import DashboardRouter from "./components/dashboard/dashboardRouter";
import Payments from "./components/payments/payments";
import AddPayment from "./components/payments/addPayment";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserProfile(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <Routes>
      {!user && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}

      {user && (
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardRouter />} />
          <Route path="dashboard" element={<DashboardRouter />} />

          <Route path="clinics" element={<ClinicsPage />} />
          <Route path="clinics/:id" element={<ClinicDetails />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="doctors/:id" element={<DoctorDetails />} />
          <Route path="addDoctor" element={<AddDoctor />} />
          <Route path="myAppointments" element={<Appointments />} />

          {user.role === "admin" && (
            <Route path="addClinic" element={<AddClinic />} />
          )}

          <Route path="profile" element={<Profile />} />
          <Route path="messages" element={<Messages />} />
          <Route path="myPatients" element={<MyPatient />} />
          <Route path="myPatients/:id" element={<PatientDetails />} />
          <Route path="myMedicalHistory" element={<MyMedicalHistory />} />
          <Route path="addAssistant" element={<AddAssistant />} />
          <Route path="myAssistant" element={<MyAssistant />} />
          <Route path="appointmentRequests" element={<AppointmentRequest />} />
          <Route path="myAppointmentRequests" element={<MyAppointmnetRequest />} />
          <Route path="pharmacy" element={<PharmacyList />} />
          <Route path="pharmacyList" element={<PharmacyList />} />
          <Route path="pharmacy/:id" element={<PharmacyDetails />} />
          <Route path="addPharmacy" element={<AddPharmacy />} />
          <Route path="addMedicine" element={<AddMedicine />} />
          <Route path="medicines" element={<MedicineList />} />
          <Route path="allMedicine" element={<AllMedicine />} />
          <Route path = "myCart" element={<MyCart />} />
          <Route path = "myCheckOut" element={<MyCheckOut />} />
          <Route path="myOrders" element={<MyOrders />} />
          <Route path="pharmacy/orders" element={<PharmacyOrders />} />
          <Route path="admin/orders" element={<AllOrders />} />
          <Route path = 'payments' element={<Payments />} />
          <Route path = 'addPayment' element={<AddPayment />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
