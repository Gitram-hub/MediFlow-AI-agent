import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./RoleLogin.css";

const ROLE_CONFIG = {
  patient: {
    label: "Patient",
    eyebrow: "Your care, connected",
    title: "Welcome back,",
    accent: "from-cyan-400 to-emerald-400",
    glow: "role-glow-cyan",
    icon: "♥",
    description: "View your health journey, talk to the AI assistant, and book trusted care.",
    email: "demo@mediflow.local",
    password: "demo",
    destination: "/dashboard",
  },
  doctor: {
    label: "Doctor",
    eyebrow: "Care, with clarity",
    title: "Good to see you,",
    accent: "from-blue-400 to-violet-400",
    glow: "role-glow-blue",
    icon: "✚",
    description: "Manage your availability and give every patient a better care experience.",
    email: "doctor@mediflow.local",
    password: "demo",
    destination: "/doctor-dashboard",
  },
  hospital: {
    label: "Hospital",
    eyebrow: "Better operations, better care",
    title: "Your hospital hub,",
    accent: "from-amber-300 to-orange-400",
    glow: "role-glow-amber",
    icon: "⌂",
    description: "Coordinate doctors, departments, and appointments from one secure place.",
    email: "hospital@mediflow.local",
    password: "demo",
    destination: "/hospital-dashboard",
  },
  admin: {
    label: "Administrator",
    eyebrow: "The control center",
    title: "Welcome,",
    accent: "from-fuchsia-400 to-rose-400",
    glow: "role-glow-rose",
    icon: "◆",
    description: "Review approvals, protect the provider directory, and monitor MediFlow.",
    email: "admin@mediflow.local",
    password: "demo",
    destination: "/admin-dashboard",
  },
};

function RoleIcon({ symbol }) {
  return <span className="role-icon" aria-hidden="true">{symbol}</span>;
}

export default function RoleLogin() {
  const { role = "patient" } = useParams();
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.patient;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const demoMode = import.meta.env.VITE_DEMO_MODE === "true";

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    window.setTimeout(() => {
      const validDemo = demoMode && email === config.email && password === config.password;
      if (!validDemo) {
        setError(
          demoMode
            ? `Demo access: ${config.email} / ${config.password}`
            : "This role login requires the backend role-authentication service."
        );
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("mediflow_role", role);
      localStorage.setItem("mediflow_email", email);
      if (remember) localStorage.setItem("mediflow_remember", "true");
      navigate(config.destination);
    }, 650);
  };

  return (
    <main className={`role-login-shell ${config.glow}`}>
      <div className="role-orb role-orb-one" />
      <div className="role-orb role-orb-two" />
      <div className="role-grid" />

      <section className="role-login-card">
        <div className="role-showcase">
          <Link to="/" className="role-brand">
            <span className="brand-mark">M</span>
            <span>MediFlow <b>AI</b></span>
          </Link>

          <div className="showcase-copy">
            <div className="floating-role-badge"><RoleIcon symbol={config.icon} /></div>
            <p className="role-eyebrow">{config.eyebrow}</p>
            <h1>{config.title}<br /><span className={`text-gradient ${config.accent}`}>{config.label}</span></h1>
            <p>{config.description}</p>
          </div>

          <div className="showcase-status">
            <span className="status-dot" />
            <span>Secure care network</span>
            <span className="status-line" />
            <span>24/7 connected</span>
          </div>
        </div>

        <div className="role-form-panel">
          <div className="mobile-brand">
            <Link to="/" className="role-brand"><span className="brand-mark">M</span><span>MediFlow <b>AI</b></span></Link>
          </div>
          <div className="form-heading">
            <p>Sign in as</p>
            <h2>{config.label}</h2>
            <span>Enter your credentials to continue</span>
          </div>

          <div className="role-switcher" aria-label="Choose account type">
            {Object.entries(ROLE_CONFIG).map(([key, item]) => (
              <Link className={key === role ? "active" : ""} to={`/login/${key}`} key={key}>
                {item.label === "Administrator" ? "Admin" : item.label}
              </Link>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="role-form">
            <label>
              Email address
              <span className="input-wrap">
                <span className="input-icon">@</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={config.email} required />
              </span>
            </label>
            <label>
              Password
              <span className="input-wrap">
                <span className="input-icon">●</span>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
            </label>

            <div className="form-options">
              <label className="remember-option"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> Remember me</label>
              <button type="button" className="forgot-button" onClick={() => setError("Password recovery will be available after role authentication is connected.")}>Forgot password?</button>
            </div>

            {error && <p className="role-error" role="alert">{error}</p>}
            <button className={`role-submit bg-gradient-to-r ${config.accent}`} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Opening secure workspace..." : `Continue as ${config.label}`}
              {!isSubmitting && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <p className="form-footer">New to MediFlow? <button type="button" onClick={() => setError("Registration and account approval will be enabled with role authentication.")}>Request access</button></p>
          <p className="privacy-note">🔒 Your information is protected with secure access controls.</p>
        </div>
      </section>
    </main>
  );
}
