import { Link, useParams } from "react-router-dom";

const DASHBOARD_CONTENT = {
  doctor: {
    title: "Doctor workspace",
    subtitle: "Your appointments and availability at a glance.",
    accent: "text-blue-300",
    cards: [["Today’s appointments", "8", "View schedule"], ["Open slots", "12", "Manage availability"], ["Patient messages", "4", "Review messages"]],
  },
  hospital: {
    title: "Hospital workspace",
    subtitle: "Coordinate your care network from one place.",
    accent: "text-amber-300",
    cards: [["Affiliated doctors", "24", "Manage directory"], ["Today’s bookings", "46", "View appointments"], ["Departments", "9", "Manage departments"]],
  },
  admin: {
    title: "Admin control center",
    subtitle: "Keep the MediFlow provider network trusted and healthy.",
    accent: "text-fuchsia-300",
    cards: [["Pending approvals", "7", "Review requests"], ["Active providers", "138", "Manage directory"], ["Emergency alerts", "2", "Open alert queue"]],
  },
};

export default function RoleDashboard({ role: roleProp }) {
  const { role: routeRole } = useParams();
  const role = roleProp || routeRole || "doctor";
  const content = DASHBOARD_CONTENT[role] || DASHBOARD_CONTENT.doctor;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] p-6 text-white md:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-emerald-300 text-slate-900">M</span>
            MediFlow <span className="text-cyan-300">AI</span>
          </Link>
          <Link to={`/login/${role}`} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-300 hover:text-white">Sign out</Link>
        </header>
        <section className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <p className={`mb-2 text-sm font-semibold uppercase tracking-[.18em] ${content.accent}`}>Demo workspace</p>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{content.title}</h1>
          <p className="mt-3 text-slate-400">{content.subtitle}</p>
        </section>
        <div className="grid gap-5 md:grid-cols-3">
          {content.cards.map(([label, value, action]) => (
            <article key={label} className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-white/10">
              <p className="text-sm text-slate-400">{label}</p>
              <p className={`my-4 text-4xl font-bold ${content.accent}`}>{value}</p>
              <button type="button" className="text-sm text-cyan-300">{action} →</button>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">Demo workspace preview. Role approval and backend authorization will control real records.</p>
      </div>
    </main>
  );
}
