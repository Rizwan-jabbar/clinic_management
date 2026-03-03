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
import AppointmentForm from "./components/appointment/appoinment";
import MyPatient from "./components/myPatient/myPatient";

function App() {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // ✅ Fetch Profile When User Exists
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserProfile(user.id));
    }
  }, [dispatch, user?.id]);

  
  return (
    <Routes>

      {/* ================= NOT LOGGED IN ================= */}
      {!user && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}

      {/* ================= LOGGED IN ================= */}
      {user && (
        <Route path="/" element={<Layout />}>

          {/* ✅ Default Page */}
          <Route
            index
            element={
              user.role === "admin"
                ? <ClinicsPage />
                : <DoctorsPage />
            }
          />

          {/* ✅ Everyone Can See */}
          <Route path="clinics" element={<ClinicsPage />} />
          <Route path="clinics/:id" element={<ClinicDetails />} />

          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="doctors/:id" element={<DoctorDetails />} />
          <Route path="addDoctor" element={<AddDoctor />} />

          <Route path="bookAppointment" element={<AppointmentForm />} />
          <Route path = "myAppointments" element={<Appointments />} />

          {/* ✅ Admin Only */}
          {user.role === "admin" && (
            <Route path="addClinic" element={<AddClinic />} />
          )}

          {/* ✅ Common */}
          <Route path="profile" element={<Profile />} />
          <Route path="messages" element={<Messages />} />
          <Route path="myPatients" element={<MyPatient />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Route>
      )}

    </Routes>
  );
}

export default App;