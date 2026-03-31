import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMedicine } from "../../redux/medicineThunk/medicineThunk"; // ✅ thunk import

const categoriesEnum = ["Tablet", "Capsule", "Syrup", "Injection", "Other"];

const AddMedicine = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.medicine);

  const [previewName, setPreviewName] = useState("");
  const [form, setForm] = useState({
    name: "",
    genericName: "",
    brand: "",
    manufacturer: "",
    category: "",
    dosageForm: "",
    strength: "",
    purchasePrice: "",
    sellingPrice: "",
    stock: "",
    expiryDate: "",
    batchNumber: "",
    description: "",
    image: null,
  });

  const resetForm = () => {
    setForm({
      name: "",
      genericName: "",
      brand: "",
      manufacturer: "",
      category: "",
      dosageForm: "",
      strength: "",
      purchasePrice: "",
      sellingPrice: "",
      stock: "",
      expiryDate: "",
      batchNumber: "",
      description: "",
      image: null,
    });
    setPreviewName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    dispatch(addMedicine(formData));
  };

  useEffect(() => {
    if (success) resetForm(); // reset form after successful addition
  }, [success]);

  const sharedInput =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-10 md:px-10">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Header */}
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            Inventory
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Add new medicine
          </h1>
        </header>

        {/* Form */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">

            <input type="text" placeholder="Medicine Name" required
              className={sharedInput}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input type="text" placeholder="Generic Name"
              className={sharedInput}
              value={form.genericName}
              onChange={(e) => setForm({ ...form, genericName: e.target.value })}
            />

            <input type="text" placeholder="Brand"
              className={sharedInput}
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />

            <input type="text" placeholder="Manufacturer"
              className={sharedInput}
              value={form.manufacturer}
              onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
            />

            <select required className={sharedInput}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select Category</option>
              {categoriesEnum.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <input type="text" placeholder="Dosage Form"
              className={sharedInput}
              value={form.dosageForm}
              onChange={(e) => setForm({ ...form, dosageForm: e.target.value })}
            />

            <input type="text" placeholder="Strength"
              className={sharedInput}
              value={form.strength}
              onChange={(e) => setForm({ ...form, strength: e.target.value })}
            />

            <input type="number" placeholder="Purchase Price" required
              className={sharedInput}
              value={form.purchasePrice}
              onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
            />

            <input type="number" placeholder="Selling Price" required
              className={sharedInput}
              value={form.sellingPrice}
              onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
            />

            <input type="number" placeholder="Stock"
              className={sharedInput}
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />

            <input type="date" required
              className={sharedInput}
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            />

            <input type="text" placeholder="Batch Number"
              className={sharedInput}
              value={form.batchNumber}
              onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
            />

            {/* IMAGE UPLOAD */}
            <div className="md:col-span-2 space-y-3">
              <p className="text-sm font-semibold text-slate-600">Medicine Image</p>
              <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-slate-500 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer">
                <span className="text-3xl">📤</span>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Upload medicine image</p>
                  <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setForm({ ...form, image: file || null });
                    setPreviewName(file ? file.name : "");
                  }}
                />
              </label>
              {previewName && (
                <p className="text-xs text-blue-600">Selected: <span className="font-medium">{previewName}</span></p>
              )}
            </div>

            <div className="md:col-span-2">
              <textarea rows="3" placeholder="Description"
                className={sharedInput}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              ></textarea>
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-blue-500 hover:to-indigo-400 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Medicine"}
              </button>
            </div>

            {/* Backend Error */}
            {error && (
              <p className="md:col-span-2 mt-4 text-red-500 text-sm text-center">{error}</p>
            )}

          </form>
        </section>
      </div>

      {/* Success Popup */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-white p-8 rounded-3xl text-center">
            <h2 className="text-xl font-semibold text-blue-600">
              ✅ Medicine Added
            </h2>
            <button
              onClick={() => resetForm()}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-xl"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMedicine;
