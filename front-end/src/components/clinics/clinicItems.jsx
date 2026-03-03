import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteClinic,
  updateClinicStatus,
  updateClinic,
} from "../../redux/clinicThunk/clinicThunk";

const ModalPortal = ({ children }) => {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
};

const ClinicItem = ({ clinic }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const isAdmin = user?.role === "admin";

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const stopPropagation = (e, callback) => {
    e.preventDefault();
    e.stopPropagation();
    if (callback) callback();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handleStatusToggle = () => {
    dispatch(
      updateClinicStatus({
        clinicId: clinic._id,
        newStatus: clinic.status === "Active" ? "Inactive" : "Active",
      })
    );
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-500">
              Clinic
            </p>
            <h3 className="text-lg font-semibold text-slate-900">
              {clinic.name}
            </h3>
            <p className="text-sm text-slate-500">{clinic.location}</p>
          </div>

          <span
            className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${
              clinic.status === "Active"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {clinic.status}
          </span>
        </div>

        <div className="mt-3 space-y-1 text-sm text-slate-600">
          <p>👩‍⚕️ Doctors: {clinic.doctors || "N/A"}</p>
          <p>🏥 Capacity: {clinic.capacity || "N/A"}</p>
          <p>
            🕒 Timings: {clinic.openingTime || "--"} –{" "}
            {clinic.closingTime || "--"}
          </p>
          <p>📞 Phone: {clinic.phone || "N/A"}</p>
        </div>

        {isAdmin && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={(e) =>
                stopPropagation(e, () => setShowEditForm(true))
              }
              className="flex-1 min-w-[140px] rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              Edit
            </button>
            <button
              onClick={(e) =>
                stopPropagation(e, () => setShowDeleteConfirm(true))
              }
              className="flex-1 min-w-[140px] rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              Delete
            </button>
            <button
              onClick={(e) => stopPropagation(e, handleStatusToggle)}
              className="flex-1 min-w-[140px] rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
            >
              {clinic.status === "Active" ? "Deactivate" : "Activate"}
            </button>
          </div>
        )}
      </div>

      {isAdmin && showDeleteConfirm && (
        <ModalPortal>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-slate-900">
                Delete clinic?
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                This action can’t be undone.
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
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
                  className="flex-1 rounded-xl bg-rose-600 py-2 text-sm font-semibold text-white shadow shadow-rose-500/30 transition hover:bg-rose-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {isAdmin && showEditForm && (
        <ModalPortal>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
            onClick={() => setShowEditForm(false)}
          >
            <div
              className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-slate-900">
                ✏ Edit Clinic
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {Object.keys(formData).map((key) => (
                  <label key={key} className="text-xs font-semibold text-slate-600">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {key === "description" ? (
                      <textarea
                        name={key}
                        rows="3"
                        value={formData[key] || ""}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    ) : (
                      <input
                        type="text"
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    )}
                  </label>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUpdateSubmit();
                  }}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white shadow shadow-blue-500/30 transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Updating..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
};

export default ClinicItem;