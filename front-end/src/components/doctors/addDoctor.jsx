import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addDoctor } from "../../redux/doctorThunk/doctorThunk";
import { getClinics } from "../../redux/clinicThunk/clinicThunk";

const specializationsEnum = [
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Gynecologist",
  "Psychiatrist",
  "General Physician",
  "ENT Specialist",
  "Oncologist",
];

const qualificationsEnum = [
  "MBBS",
  "MD",
  "MS",
  "BDS",
  "MDS",
  "DM",
  "MCh",
  "DNB",
  "PhD",
  "BAMS",
  "BHMS",
];

const AddDoctor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success } = useSelector((state) => state.doctors);
  const { clinics } = useSelector((state) => state.clinics);

  const [showPopup, setShowPopup] = useState(false);
  const [previewName, setPreviewName] = useState("");

  useEffect(() => {
    dispatch(getClinics());
  }, [dispatch]);

  useEffect(() => {
    if (success) setShowPopup(true);
  }, [success]);

  const [form, setForm] = useState({
    name: "",
    specializations: [],
    qualifications: [],
    clinic: "",
    phone: "",
    email: "",
    password: "",
    experience: "",
    availability: "",
    profilePicture: null,
  });

  const resetForm = () => {
    setForm({
      name: "",
      specializations: [],
      qualifications: [],
      clinic: "",
      phone: "",
      email: "",
      password: "",
      experience: "",
      availability: "",
      profilePicture: null,
    });
    setPreviewName("");
  };

  const handleSpecialization = (e) => {
    const value = e.target.value;
    if (value && !form.specializations.includes(value)) {
      setForm({ ...form, specializations: [...form.specializations, value] });
    }
  };

  const removeSpecialization = (value) => {
    setForm({
      ...form,
      specializations: form.specializations.filter((item) => item !== value),
    });
  };

  const toggleQualification = (value) => {
    if (form.qualifications.includes(value)) {
      setForm({
        ...form,
        qualifications: form.qualifications.filter((item) => item !== value),
      });
    } else {
      setForm({
        ...form,
        qualifications: [...form.qualifications, value],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.specializations.length || !form.qualifications.length) {
      alert("Select specialization and qualification");
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (Array.isArray(form[key])) {
        form[key].forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, form[key]);
      }
    });

    dispatch(addDoctor(formData));
  };

  const sharedInput =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-10 md:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            Onboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Add a new doctor
          </h1>
          <p className="text-sm text-slate-500">
            Complete the profile with credentials, clinic, and schedule details.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
            <input
              type="text"
              placeholder="Doctor Name"
              required
              className={sharedInput}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="text"
              placeholder="Phone"
              required
              className={sharedInput}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              required
              className={sharedInput}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              required
              className={sharedInput}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <input
              type="number"
              placeholder="Experience (Years)"
              min="0"
              required
              className={sharedInput}
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
            />

            <select
              required
              className={sharedInput}
              value={form.clinic}
              onChange={(e) => setForm({ ...form, clinic: e.target.value })}
            >
              <option value="">Select Clinic</option>
              {clinics?.map((clinic) => (
                <option key={clinic._id} value={clinic._id}>
                  {clinic.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Availability (e.g., Mon-Fri • 10am-4pm)"
              required
              className={sharedInput}
              value={form.availability}
              onChange={(e) => setForm({ ...form, availability: e.target.value })}
            />

            <div className="md:col-span-2 space-y-3">
              <label className="text-sm font-semibold text-slate-600">
                Specializations
              </label>
              <select
                className={sharedInput}
                onChange={handleSpecialization}
              >
                <option value="">Select Specialization</option>
                {specializationsEnum.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-2">
                {form.specializations.map((item) => (
                  <span
                    key={item}
                    onClick={() => removeSpecialization(item)}
                    className="cursor-pointer rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  >
                    {item} ✕
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <p className="text-sm font-semibold text-slate-600">
                Qualifications
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {qualificationsEnum.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-200"
                      checked={form.qualifications.includes(item)}
                      onChange={() => toggleQualification(item)}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <p className="text-sm font-semibold text-slate-600">
                Profile Picture
              </p>
              <label
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-slate-500 transition hover:border-blue-400 hover:bg-blue-50/50"
              >
                <span className="text-3xl">📤</span>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs text-slate-400">
                    PNG, JPG up to 5MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setForm({ ...form, profilePicture: file || null });
                    setPreviewName(file ? file.name : "");
                  }}
                />
              </label>
              {previewName && (
                <p className="text-xs text-blue-600">
                  Selected: <span className="font-medium">{previewName}</span>
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-400/30 transition hover:from-green-500 hover:to-emerald-400 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Doctor"}
              </button>
            </div>
          </form>
        </section>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-2xl">
            <h2 className="text-2xl font-semibold text-emerald-600">
              ✅ Doctor added successfully
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              The doctor profile is now live in the directory.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setShowPopup(false);
                }}
                className="rounded-2xl border border-blue-500/30 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
              >
                Add another
              </button>
              <button
                onClick={() => {
                  setShowPopup(false);
                  navigate("/doctors");
                }}
                className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow shadow-emerald-400/40 transition hover:bg-emerald-600"
              >
                Visit doctor list
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDoctor;