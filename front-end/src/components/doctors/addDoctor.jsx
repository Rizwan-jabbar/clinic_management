import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDoctor } from "../../redux/doctorThunk/doctorThunk";
import { getClinics } from "../../redux/clinicThunk/clinicThunk";
import { useNavigate } from "react-router-dom";

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
  "Oncologist"
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
  "BHMS"
];

const AddDoctor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success } = useSelector((state) => state.doctors);
  const { clinics } = useSelector((state) => state.clinics);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    dispatch(getClinics());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setShowPopup(true);
    }
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
    profilePicture: null
  });

  /* ================= RESET FORM ================= */
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
      profilePicture: null
    });
  };

  /* ================= SPECIALIZATION ================= */
  const handleSpecialization = (e) => {
    const value = e.target.value;

    if (value && !form.specializations.includes(value)) {
      setForm({
        ...form,
        specializations: [...form.specializations, value]
      });
    }
  };

  const removeSpecialization = (value) => {
    setForm({
      ...form,
      specializations: form.specializations.filter(
        (item) => item !== value
      )
    });
  };

  /* ================= QUALIFICATIONS ================= */
  const toggleQualification = (value) => {
    if (form.qualifications.includes(value)) {
      setForm({
        ...form,
        qualifications: form.qualifications.filter(
          (item) => item !== value
        )
      });
    } else {
      setForm({
        ...form,
        qualifications: [...form.qualifications, value]
      });
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      form.specializations.length === 0 ||
      form.qualifications.length === 0
    ) {
      alert("Select specialization and qualification");
      return;
    }

    const formData = new FormData();
    console.log(form);

    Object.keys(form).forEach((key) => {
      if (Array.isArray(form[key])) {
        form[key].forEach((item) =>
          formData.append(key, item)
        );
      } else {
        formData.append(key, form[key]);
      }
    });

    dispatch(addDoctor(formData));
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-lg">

        <h2 className="text-3xl font-bold mb-6">
          Add Doctor
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

          <input
            type="text"
            placeholder="Doctor Name"
            required
            className="border p-3 rounded-xl"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Phone"
            required
            className="border p-3 rounded-xl"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            required
            className="border p-3 rounded-xl"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="border p-3 rounded-xl"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Experience (Years)"
            required
            min="0"
            className="border p-3 rounded-xl"
            value={form.experience}
            onChange={(e) =>
              setForm({ ...form, experience: e.target.value })
            }
          />

          <select
            required
            className="border p-3 rounded-xl"
            value={form.clinic}
            onChange={(e) =>
              setForm({ ...form, clinic: e.target.value })
            }
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
            placeholder="Availability"
            required
            className="border p-3 rounded-xl"
            value={form.availability}
            onChange={(e) =>
              setForm({ ...form, availability: e.target.value })
            }
          />

          {/* Specializations */}
          <div className="md:col-span-2">
            <select
              className="border p-3 rounded-xl w-full"
              onChange={handleSpecialization}
            >
              <option value="">Select Specialization</option>
              {specializationsEnum.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2 mt-2">
              {form.specializations.map((item) => (
                <span
                  key={item}
                  onClick={() => removeSpecialization(item)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full cursor-pointer"
                >
                  {item} ✕
                </span>
              ))}
            </div>
          </div>

          {/* Qualifications */}
          <div className="md:col-span-2">
            <p className="font-semibold mb-2">
              Qualifications
            </p>

            <div className="grid grid-cols-2 gap-2">
              {qualificationsEnum.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={form.qualifications.includes(item)}
                    onChange={() => toggleQualification(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            className="border p-3 rounded-xl"
            onChange={(e) =>
              setForm({
                ...form,
                profilePicture: e.target.files[0]
              })
            }
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl w-full"
            >
              {loading ? "Saving..." : "Save Doctor"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= SUCCESS POPUP ================= */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-96">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              ✅ Doctor Added Successfully
            </h2>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setShowPopup(false);
                }}
                className="bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600"
              >
                Add Another
              </button>

              <button
                onClick={() => {
                  setShowPopup(false);
                  navigate("/doctors");
                }}
                className="bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
              >
                Visit Doctor List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDoctor;