import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addClinic, getClinics } from "../../redux/clinicThunk/clinicThunk";
import { clearMessage } from "../../redux/clinicSlice/clinicSlice";

const AddClinic = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const message = useSelector((state) => state.clinics.message);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addClinic(form));
    dispatch(getClinics());
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
        navigate("/clinics");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch, navigate]);

  const sharedInput =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-10 md:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Hero */}
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-500">
            Clinics
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Add a new clinic
          </h1>
          <p className="text-sm text-slate-500">
            Capture capacity, timing, and contact details to keep your network up to date.
          </p>
        </header>

        {/* Form card */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { label: "Clinic Name", name: "name", type: "text" },
              { label: "Doctors", name: "doctors", type: "number" },
              { label: "Capacity", name: "capacity", type: "number" },
              { label: "Location", name: "location", type: "text" },
              { label: "Phone", name: "phone", type: "tel" },
            ].map((field) => (
              <label key={field.name} className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
                {field.label}
                <input
                  type={field.type}
                  required
                  value={form[field.name]}
                  onChange={(e) =>
                    setForm({ ...form, [field.name]: e.target.value })
                  }
                  className={sharedInput}
                />
              </label>
            ))}

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
              Opening Time
              <input
                type="time"
                value={form.openingTime}
                onChange={(e) =>
                  setForm({ ...form, openingTime: e.target.value })
                }
                className={sharedInput}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
              Closing Time
              <input
                type="time"
                value={form.closingTime}
                onChange={(e) =>
                  setForm({ ...form, closingTime: e.target.value })
                }
                className={sharedInput}
              />
            </label>

            <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-600">
                Description
              </span>
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className={`${sharedInput} resize-none`}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-2 text-sm font-semibold text-slate-600">
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
                className={sharedInput}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="col-span-full mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/clinics")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700 sm:w-auto"
              >
                Add Clinic
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Success popup */}
      {message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-2xl">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-xl font-semibold text-emerald-600">
              Clinic created successfully!
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Your clinic has been added to the directory.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
                className="flex-1 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
              >
                ➕ Add Another
              </button>
              <button
                onClick={() => {
                  dispatch(clearMessage());
                  navigate("/clinics");
                }}
                className="flex-1 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow shadow-emerald-400/40 transition hover:bg-emerald-600"
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