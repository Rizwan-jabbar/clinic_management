import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteClinic,
  updateClinicStatus,
  updateClinic,
} from "../../redux/clinicThunk/clinicThunk";

const ClinicItem = ({ clinic }) => {
  const dispatch = useDispatch();

  /* ================= USER FROM REDUX ================= */
  const { user } = useSelector((state) => state.user);
  const isAdmin = user?.role === "admin";

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= FORM STATE ================= */

  const [formData, setFormData] = useState({
    name: "",
    doctors: "",
    capacity: "",
    location: "",
    phone: "",
    openingTime: "",
    closingTime: "",
    description: "",
  });

  /* ================= AUTO FILL ================= */

  useEffect(() => {
    if (clinic) {
      setFormData({
        name: clinic.name || "",
        doctors: clinic.doctors || "",
        capacity: clinic.capacity || "",
        location: clinic.location || "",
        phone: clinic.phone || "",
        openingTime: clinic.openingTime || "",
        closingTime: clinic.closingTime || "",
        description: clinic.description || "",
      });
    }
  }, [clinic]);

  /* ================= SCROLL LOCK ================= */

  useEffect(() => {
    if (showDeleteConfirm || showEditForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showDeleteConfirm, showEditForm]);

  if (!clinic) return null;

  /* ================= PROPAGATION HANDLER ================= */

  const stopPropagation = (e, callback) => {
    e.preventDefault();
    e.stopPropagation();
    if (callback) callback();
  };

  /* ================= FORM CHANGE ================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= UPDATE ================= */

  const handleUpdateSubmit = async () => {
    try {
      setLoading(true);

      await dispatch(
        updateClinic({
          clinicId: clinic._id,
          updatedData: formData,
        })
      ).unwrap();

      setShowEditForm(false);
    } catch (error) {
      console.error("Update Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS TOGGLE ================= */

  const handleStatusToggle = () => {
    dispatch(
      updateClinicStatus({
        clinicId: clinic._id,
        newStatus:
          clinic.status === "Active" ? "Inactive" : "Active",
      })
    );
  };

  return (
    <>
      {/* ================= CARD ================= */}
      <div className="w-full p-6 rounded-3xl shadow-xl bg-gradient-to-br from-blue-100 to-blue-200 hover:shadow-2xl transition duration-300">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {clinic.name}
          </h3>

          <span
            className={`px-3 py-1 text-xs rounded-full text-white ${
              clinic.status === "Active"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {clinic.status}
          </span>
        </div>

        {/* INFO */}
        <div className="space-y-2 text-sm mb-6">
          <p>👨‍⚕️ Doctors: {clinic.doctors}</p>
          <p>
            🕒 Timings: {clinic.openingTime} -{" "}
            {clinic.closingTime}
          </p>
          <p>🏥 Capacity: {clinic.capacity}</p>
        </div>

        {/* ================= ADMIN BUTTONS ================= */}
        {isAdmin && (
          <div className="flex gap-3">

            {/* EDIT */}
            <button
              onClick={(e) =>
                stopPropagation(e, () => setShowEditForm(true))
              }
              className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Edit
            </button>

            {/* DELETE */}
            <button
              onClick={(e) =>
                stopPropagation(e, () => setShowDeleteConfirm(true))
              }
              className="flex-1 bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
            >
              Delete
            </button>

            {/* STATUS */}
            <button
              onClick={(e) =>
                stopPropagation(e, handleStatusToggle)
              }
              className="flex-1 bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition"
            >
              {clinic.status === "Active"
                ? "Deactivate"
                : "Activate"}
            </button>

          </div>
        )}
      </div>

      {/* ================= DELETE MODAL ================= */}
      {isAdmin && showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowDeleteConfirm(false)}
          />

          <div className="relative bg-white w-[90%] max-w-md rounded-3xl shadow-2xl p-8">
            <h2 className="text-xl font-bold mb-4">
              Delete Clinic?
            </h2>

            <p className="mb-6">
              Are you sure? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-4">

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowDeleteConfirm(false);
                }}
                className="px-5 py-2 bg-gray-300 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={(e) =>
                  stopPropagation(e, () => {
                    dispatch(deleteClinic(clinic._id));
                    setShowDeleteConfirm(false);
                  })
                }
                className="px-5 py-2 bg-red-600 text-white rounded-xl"
              >
                Delete
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {isAdmin && showEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowEditForm(false)}
          />

          <div className="relative bg-white w-[95%] max-w-2xl rounded-3xl shadow-2xl p-10 max-h-[90vh] overflow-y-auto">

            <h2 className="text-2xl font-bold mb-8">
              ✏ Edit Clinic
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              {Object.keys(formData).map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="font-semibold mb-2 capitalize">
                    {key}
                  </label>

                  {key === "description" ? (
                    <textarea
                      name={key}
                      value={formData[key] || ""}
                      onChange={handleChange}
                      rows="3"
                      className="border px-4 py-2 rounded-xl"
                    />
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={formData[key] || ""}
                      onChange={handleChange}
                      className="border px-4 py-2 rounded-xl"
                    />
                  )}
                </div>
              ))}

            </div>

            <div className="flex justify-end gap-4 mt-8">

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowEditForm(false);
                }}
                className="px-6 py-2 bg-gray-300 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleUpdateSubmit();
                }}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-50"
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ClinicItem;