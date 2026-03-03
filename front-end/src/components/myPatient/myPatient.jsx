import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";
import { getAppointments } from "../../redux/appointmentThunk/appointmentThunk";

function MyPatient() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { appointments } = useSelector((state) => state.appointments);

  const patients = appointments?.filter(
    (pat) => pat.doctor._id === user?._id
  );

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(getAppointments());
  }, [dispatch]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        My Patients
      </h1>

      {patients && patients.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {patients.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-xl shadow-md 
                         border border-gray-100 
                         p-5 transition hover:shadow-lg"
            >
              {/* Top Section */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {appointment.patient.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {appointment.patient.email}
                  </p>
                </div>

                <div className="bg-blue-100 text-blue-600 
                                h-10 w-10 rounded-full 
                                flex items-center justify-center 
                                font-bold">
                  {appointment.patient.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Clinic */}
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Clinic:</span>{" "}
                {appointment.clinic?.name}
              </p>

              {/* Date */}
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Date:</span>{" "}
                {new Date(
                  appointment.appointmentDate
                ).toLocaleDateString()}
              </p>

              {/* Status Row */}
              <div className="flex justify-between mt-4">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    appointment.status === "Cancelled"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {appointment.status}
                </span>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    appointment.paymentStatus === "Unpaid"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {appointment.paymentStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No patients found.</p>
      )}
    </div>
  );
}

export default MyPatient;