import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import { getAssistants } from "../../../redux/assistantThunk/assistantThunk";
import { fetchUserProfile } from "../../../redux/userThunk/userThunk";
import { NavLink } from "react-router-dom";

const StatusBadge = ({ status = "Active" }) => {
  const palette = {
    Active: "text-emerald-700 bg-emerald-50 border-emerald-200",
    Inactive: "text-slate-600 bg-slate-100 border-slate-200",
    Suspended: "text-amber-700 bg-amber-50 border-amber-200",
  };
  const color = palette[status] || palette.Active;
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${color}`}
    >
      {status}
    </span>
  );
};

const AssistantRow = ({ assistant }) => {
  const fullName = assistant?.fullName || assistant?.name || "Unnamed Assistant";
  const role = assistant?.role || "Assistant";
  const email = assistant?.email || "—";
  const phone = assistant?.phone || assistant?.phoneNumber || "—";
  const clinic =
    assistant?.assignedClinic?.name ||
    assistant?.assignedClinic ||
    assistant?.clinic ||
    "Unassigned";
  const shift = assistant?.shift || assistant?.availability || "Schedule pending";
  const experience =
    assistant?.experience != null ? `${assistant.experience} yrs` : "—";
  const status = assistant?.status || "Active";

  return (
    <li className="border-b border-slate-100 px-4 py-4 text-sm text-slate-700 last:border-b-0">
      {/* mobile layout */}
      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-slate-900">{fullName}</p>
            <p className="text-xs text-slate-500">{role}</p>
          </div>
          <StatusBadge status={status} />
        </div>
        <div className="space-y-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-500">
          <p className="flex items-center gap-2 text-slate-600 normal-case tracking-normal text-sm">
            <HiOutlineEnvelope className="text-slate-400" />
            {email}
          </p>
          <p className="flex items-center gap-2 text-slate-600 normal-case tracking-normal text-sm">
            <HiOutlinePhone className="text-slate-400" />
            {phone}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <HiOutlineMapPin className="text-slate-400" />
            {clinic}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <HiOutlineClock className="text-slate-400" />
            {shift}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {experience}
          </span>
        </div>
      </div>

      {/* desktop layout */}
      <div className="hidden grid-cols-[1.4fr_1.2fr_1fr_1fr_0.8fr] items-center gap-6 md:grid">
        <div>
          <p className="text-base font-semibold text-slate-900">{fullName}</p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-slate-600">
            <HiOutlineEnvelope className="text-slate-400" />
            {email}
          </p>
          <p className="flex items-center gap-2 text-slate-600">
            <HiOutlinePhone className="text-slate-400" />
            {phone}
          </p>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <HiOutlineMapPin className="text-slate-400" />
          <span>{clinic}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2 text-slate-600">
            <HiOutlineClock className="text-slate-400" />
            {shift}
          </span>
          <span className="text-xs text-slate-500">{experience}</span>
        </div>
        <div className="flex justify-end">
          <StatusBadge status={status} />
        </div>
      </div>
    </li>
  );
};

function MyAssistant() {
  const dispatch = useDispatch();
  const {
    assistants = [],
    isLoading: assistantsLoading = false,
    error: assistantsError = null,
  } = useSelector((state) => state.assistants);
  const { user, loading: userLoading = false } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(getAssistants());
  }, [dispatch]);

  const doctorId = user?._id;
  const currentDoctorAssistants = useMemo(() => {
    if (!doctorId) return [];
    return assistants.filter(({ doctor }) => {
      if (!doctor) return false;
      if (typeof doctor === "string") return doctor === doctorId;
      return doctor?._id === doctorId;
    });
  }, [assistants, doctorId]);

  const isLoading = userLoading || assistantsLoading;
  const showEmptyState = !isLoading && !assistantsError && currentDoctorAssistants.length === 0;

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Care Team</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900">My Assistants</h1>
            <p className="text-sm text-slate-600">
              View every assistant linked to your account together with their contact and clinic information.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-700">
            <HiOutlineUserGroup className="text-2xl text-slate-500" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total</p>
              <p className="text-lg font-semibold text-slate-900">{currentDoctorAssistants.length}</p>
            </div>
          </div>
        </header>

        {assistantsError && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <HiOutlineExclamationCircle className="text-lg" />
            <span>{assistantsError}</span>
          </div>
        )}

        {isLoading && (
          <div className="space-y-3 rounded-3xl border border-slate-200 bg-white px-4 py-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-14 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        )}

        {showEmptyState && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-600">
            <h3 className="text-2xl font-semibold text-slate-900">No assistants yet</h3>
            <p className="mt-2">
              Add your first assistant to see them listed here instantly.
            </p>
            <NavLink to="/addAssistant" className="inline-block rounded-md bg-white px-4 py-2 text-sm font-medium mt-4 text-black hover:bg-white/90 transition border border-slate-200">
              Add Assistant
            </NavLink>
          </div>
        )}

        {!isLoading && currentDoctorAssistants.length > 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden gap-6 border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:grid md:grid-cols-[1.4fr_1.2fr_1fr_1fr_0.8fr]">
              <span>Assistant</span>
              <span>Contact</span>
              <span>Clinic</span>
              <span>Shift &amp; Experience</span>
              <span>Status</span>
            </div>
            <ul>
              {currentDoctorAssistants.map((assistant) => (
                <AssistantRow key={assistant._id || assistant.email} assistant={assistant} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default MyAssistant;