import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addAssistant } from "../../../redux/assistantThunk/assistantThunk";

const initialFormState = {
  name: "",
  email: "",
  password: "",
};

const FieldGroup = ({ label, htmlFor, helperText, children }) => (
  <div className="space-y-1.5">
    <label
      htmlFor={htmlFor}
      className="text-sm font-semibold text-slate-700"
    >
      {label}
    </label>
    {children}
    {helperText && (
      <p className="text-xs text-slate-500">{helperText}</p>
    )}
  </div>
);

const AddAssistant = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const redirectTimerRef = useRef(null);

  const { loading } = useSelector((state) => state.assistants);

  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [recentAssistant, setRecentAssistant] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    try {
      const created = await dispatch(addAssistant(formData)).unwrap();
      const createdAssistant = created?.assistant ?? created;

      setRecentAssistant(createdAssistant);
      setStatus({
        type: "success",
        message: "Assistant added successfully! Redirecting you now…",
      });
      setFormData(initialFormState);

      redirectTimerRef.current = setTimeout(() => {
        navigate("/my-assistant");
      }, 1800);
    } catch (err) {
      setStatus({
        type: "error",
        message: err?.message || "Unable to add assistant. Please try again.",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Care Team
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Add a New Assistant
          </h1>
          <p className="text-sm text-slate-600">
            Provide credentials for your assistant. We’ll confirm the addition
            and send you back to the roster automatically.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
            <form onSubmit={handleSubmit} className="space-y-6">
              <FieldGroup label="Assistant Name" htmlFor="name">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Ayesha Siddiqui"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </FieldGroup>

              <FieldGroup
                label="Email Address"
                htmlFor="email"
                helperText="This email will be used for their login."
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="assistant@email.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </FieldGroup>

              <FieldGroup
                label="Temporary Password"
                htmlFor="password"
                helperText="They’ll be prompted to change it on first login."
              >
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </FieldGroup>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                {status.type === "error" && (
                  <span className="inline-flex flex-1 items-center rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                    {status.message}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-blue-500/50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {loading ? "Adding Assistant…" : "Add Assistant"}
                </button>
              </div>
            </form>
          </article>

          <aside className="space-y-4">
            {status.type === "success" && recentAssistant ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 shadow-lg shadow-emerald-100">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                  Assistant Added
                </p>
                <h3 className="mt-1 text-xl font-semibold">
                  {recentAssistant.name || recentAssistant.fullName}
                </h3>
                <p className="text-sm text-emerald-700">
                  {recentAssistant.email}
                </p>
                <p className="mt-4 text-sm">
                  {status.message || "Redirecting to My Assistant…"}
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-slate-700 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Workflow
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  What happens next?
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li>1. Submit the assistant’s credentials.</li>
                  <li>2. We confirm creation instantly.</li>
                  <li>3. You’re redirected to “My Assistant”.</li>
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
};

export default AddAssistant;