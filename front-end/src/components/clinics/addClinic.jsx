import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addClinic, getClinics } from "../../redux/clinicThunk/clinicThunk";
import { clearMessage } from "../../redux/clinicSlice/clinicSlice";
import { useNavigate } from "react-router-dom";

const AddClinic = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const message = useSelector((state) => state.clinics.message);

  /* ================= FORM STATE ================= */

  const [form, setForm] = useState({
    name: "",
    doctors: "",
    capacity: "",
    openingTime: "",
    closingTime: "",
    location: "",
    phone: "",
    description: "",
    status: "Active",
  });

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addClinic(form));
    dispatch(getClinics());
  };

  /* ================= AUTO REDIRECT ================= */

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
        navigate("/clinics");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4 py-10">

      {/* ================= FORM CARD ================= */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-gray-100
        p-6 md:p-8 lg:p-10">

        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          🏥 Add New Clinic
        </h2>

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >

          {/* INPUT FIELDS */}
          {[
            { label: "Clinic Name", name: "name", type: "text" },
            { label: "Doctors", name: "doctors", type: "number" },
            { label: "Capacity", name: "capacity", type: "number" },
            { label: "Location", name: "location", type: "text" },
            { label: "Phone", name: "phone", type: "text" },
          ].map((field, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-2">
                {field.label}
              </label>

              <input
                type={field.type}
                value={form[field.name]}
                onChange={(e) =>
                  setForm({ ...form, [field.name]: e.target.value })
                }
                className="px-4 py-3 rounded-xl border border-gray-200
                focus:ring-2 focus:ring-blue-400 focus:outline-none
                transition duration-200"
                required
              />
            </div>
          ))}

          {/* TIME FIELDS */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-2">
              Opening Time
            </label>

            <input
              type="time"
              value={form.openingTime}
              onChange={(e) =>
                setForm({ ...form, openingTime: e.target.value })
              }
              className="px-4 py-3 rounded-xl border border-gray-200
              focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-2">
              Closing Time
            </label>

            <input
              type="time"
              value={form.closingTime}
              onChange={(e) =>
                setForm({ ...form, closingTime: e.target.value })
              }
              className="px-4 py-3 rounded-xl border border-gray-200
              focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="sm:col-span-2 lg:col-span-3 flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-2">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows="3"
              className="px-4 py-3 rounded-xl border border-gray-200
              focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
            />
          </div>

          {/* STATUS */}
          <div className="sm:col-span-2 lg:col-span-3 flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-2">
              Status
            </label>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className="px-4 py-3 rounded-xl border border-gray-200
              focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* BUTTONS */}
          <div className="col-span-full flex flex-col sm:flex-row justify-end gap-4 mt-6">

            <button
              type="button"
              onClick={() => navigate("/clinics")}
              className="px-6 py-3 rounded-xl bg-gray-300
              hover:bg-gray-400 transition font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600
              hover:bg-blue-700 text-white transition
              font-medium shadow-md"
            >
              Add Clinic
            </button>

          </div>

        </form>
      </div>

      {/* ================= SUCCESS POPUP ================= */}
      {message && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm
        flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-md p-8
          rounded-3xl shadow-2xl text-center">

            <div className="text-5xl mb-4">🎉</div>

            <p className="text-green-600 font-bold text-xl mb-2">
              Clinic Created Successfully!
            </p>

            <p className="text-gray-500 mb-6">
              Your clinic has been added to the system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <button
                onClick={() => {
                  dispatch(clearMessage());
                  setForm({
                    name: "",
                    doctors: "",
                    capacity: "",
                    openingTime: "",
                    closingTime: "",
                    location: "",
                    phone: "",
                    description: "",
                    status: "Active",
                  });
                }}
                className="px-6 py-3 rounded-xl bg-blue-600
                hover:bg-blue-700 text-white transition shadow-md"
              >
                ➕ Add Another
              </button>

              <button
                onClick={() => {
                  dispatch(clearMessage());
                  navigate("/clinics");
                }}
                className="px-6 py-3 rounded-xl bg-green-600
                hover:bg-green-700 text-white transition shadow-md"
              >
                🏥 Visit Clinics
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AddClinic;