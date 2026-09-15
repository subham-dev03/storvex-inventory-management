import { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
      await register(
        form.name,
        form.email,
        form.password
      );

      navigate("/dashboard");
    } catch (e) {
      setError(
        e.response?.data?.message ||
        "Unable to create account"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel">

        <div className="auth-topbar">
          <Link
            to="/"
            className="auth-logo-link"
          >
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
          <h1>
            Create your account
          </h1>

          <p>
            Start managing your inventory with Storvex.
          </p>

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
              Full name

              <input
                required
                value={form.name}
                onChange={e =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                placeholder="Alex Morgan"
              />
            </label>

            <label>
              Work email

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
                minLength="6"
                required
                value={form.password}
                onChange={e =>
                  setForm({
                    ...form,
                    password: e.target.value
                  })
                }
                placeholder="At least 6 characters"
              />
            </label>

            {/* <button
              className="btn btn-primary btn-full"
              disabled={busy}
            >
              {busy
                ? "Creating..."
                : "Create account"}
            </button> */}


            <button
              className="btn btn-primary btn-full"
              disabled={busy}
            >
              {busy ? (
                <>
                  Creating
                  <span className="button-loading">
                    <i></i>
                    <i></i>
                    <i></i>
                  </span>
                </>
              ) : (
                "Create account"
              )}
            </button>



            <p className="switch">
              Already have an account?{" "}
              <Link to="/login">
                Sign in
              </Link>
            </p>
          </form>
        </div>

      </div>

      <div className="auth-art">
        <div>
          <div className="art-icon">
            ★
          </div>

          <h2>
            Make every
            <br />
            <span>
              unit count.
            </span>
          </h2>

          <p>
            Turn inventory data into clear,
            actionable decisions for your team.
          </p>
        </div>
      </div>
    </div>
  );
}