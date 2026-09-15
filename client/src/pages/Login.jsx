import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setError("");
    setBusy(true);

    try {
      await login(
        form.email,
        form.password
      );

      navigate(
        location.state?.from || "/dashboard"
      );
    } catch (e) {
      setError(
        e.response?.data?.message ||
        "Unable to sign in"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthPage
      title="Welcome back"
      subtitle="Sign in to your Storvex workspace."
    >
      <form
        onSubmit={submit}
        className="auth-form"
      >
        {error && (
          <div className="alert">
            {error}
          </div>
        )}

        <label>
          Email

          <input
            type="email"
            required
            value={form.email}
            onChange={e =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
            placeholder="you@company.com"
          />
        </label>

        <label>
          Password

          <input
            type="password"
            required
            value={form.password}
            onChange={e =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
            placeholder="••••••••"
          />
        </label>

        {/* <button
          className="btn btn-primary btn-full"
          disabled={busy}
        >
          {busy
            ? "Signing in..."
            : "Sign in"}
        </button> */}

        <button
          className="btn btn-primary btn-full"
          disabled={busy}
        >
          {busy ? (
            <>
              Signing in
              <span className="button-loading">
                <i></i>
                <i></i>
                <i></i>
              </span>
            </>
          ) : (
            "Sign in"
          )}
        </button>

        <p className="switch">
          Don't have an account?{" "}
          <Link to="/register">
            Create one
          </Link>
        </p>
      </form>
    </AuthPage>
  );
}

function AuthPage({
  title,
  subtitle,
  children
}) {
  return (
    <div className="auth-page">
      <div className="auth-panel">

        <div className="auth-topbar">
          <Link to="/" className="auth-logo-link">
            <Logo />
          </Link>

          <Link
            className="auth-back-home"
            to="/"
          >
            ← Back to home
          </Link>
        </div>

        <div className="auth-content">
          <h1>{title}</h1>

          <p>{subtitle}</p>

          {children}
        </div>

      </div>

      <div className="auth-art">
        <div>
          <BoxesIcon />

          <h2>
            Inventory clarity,
            <br />
            <span>
              without the clutter.
            </span>
          </h2>

          <p>
            One streamlined workspace for your
            products, suppliers and sales.
          </p>
        </div>
      </div>
    </div>
  );
}

function BoxesIcon() {
  return (
    <div className="art-icon">
      ▦
    </div>
  );
}