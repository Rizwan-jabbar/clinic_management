import { NavLink } from "react-router-dom";
import { CalendarClock, ClipboardList, Pill, ShoppingCart, User } from "lucide-react";

const userLinks = [
  { to: "/allMedicine", label: "Browse Medicines", icon: Pill },
  { to: "/myCart", label: "Open Cart", icon: ShoppingCart },
  { to: "/myOrders", label: "Track Orders", icon: ClipboardList },
  { to: "/myAppointments", label: "Appointments", icon: CalendarClock },
  { to: "/profile", label: "My Profile", icon: User },
];

function UserDashboard() {
  return (
    <div className="space-y-5 font-clinic-body">
      <section className="rounded-[32px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-7">
        <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
          <User size={14} />
          Patient Dashboard
        </span>
        <h1 className="mt-4 font-clinic-heading text-[30px] font-semibold text-slate-900">
          Your Care Hub
        </h1>
        <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500">
          Browse medicines, check your orders, and manage appointment activity from one patient-friendly screen.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {userLinks.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="rounded-[28px] border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-200/35 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-300/30"
            >
              <div className="inline-flex rounded-2xl bg-sky-50 p-3 text-sky-700">
                <Icon size={18} />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">{item.label}</h2>
              <p className="mt-2 text-[12px] leading-5 text-slate-500">
                Quick access to your most important patient tools and order follow-up pages.
              </p>
            </NavLink>
          );
        })}
      </section>
    </div>
  );
}

export default UserDashboard;
