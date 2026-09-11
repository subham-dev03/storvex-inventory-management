import React from "react";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export default function Landing() {
  return (
    <div className="landing">

      <nav className="landing-nav">
        <Logo />

        <div>
          <Link
            to="/login"
            className="nav-login"
          >
            Sign in
          </Link>

          <Link
            to="/register"
            className="btn btn-primary"
          >
            Get started
            <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">

          <div className="eyebrow">
            <span>●</span>
            Modern inventory operations
          </div>

          <h1>
            Manage your inventory <em>smarter.</em>
          </h1>

          <p>
            Storvex gives growing teams one clear place to manage
            products, suppliers, stock levels and sales — without
            spreadsheet chaos.
          </p>

          <div className="hero-actions">
            <Link
              to="/register"
              className="btn btn-primary btn-lg"
            >
              Create free account
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/login"
              className="btn btn-ghost btn-lg"
            >
              Explore dashboard
            </Link>
          </div>

          <div className="trust">
            <ShieldCheck size={17} />
            Secure authentication

            <span>•</span>

            <Zap size={17} />
            Fast workflows

            <span>•</span>

            <BarChart3 size={17} />
            Live insights
          </div>

        </div>

        <div className="hero-visual">
          <div className="dash-preview">

            <div className="preview-top">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>

              <span className="preview-title">
                Inventory overview
              </span>
            </div>

            <div className="preview-kpis">
              <div>
                <small>Total stock</small>
                <b>12,480</b>
                <span className="up">+12.8%</span>
              </div>

              <div>
                <small>Inventory value</small>
                <b>$84,260</b>
                <span className="up">+8.4%</span>
              </div>
            </div>

            <div className="preview-chart">
              <div className="bars">
                {[
                  40,
                  58,
                  48,
                  72,
                  63,
                  86,
                  76,
                  94,
                  82,
                  100,
                  89,
                  108
                ].map((h, i) => (
                  <i
                    key={i}
                    style={{
                      height: `${h}px`
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="preview-table">
              <div>
                <span>Wireless Keyboard</span>
                <b>842</b>
              </div>

              <div>
                <span>USB-C Hub</span>
                <b>516</b>
              </div>

              <div>
                <span>Desk Lamp Pro</span>
                <b>284</b>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="features">

        <div>
          <Boxes />

          <h3>
            Everything in one place
          </h3>

          <p>
            Products, stock movements, suppliers and sales
            stay connected.
          </p>
        </div>

        <div>
          <BarChart3 />

          <h3>
            Know what needs attention
          </h3>

          <p>
            See low-stock items and key business metrics
            at a glance.
          </p>
        </div>

        <div>
          <Zap />

          <h3>
            Built for daily speed
          </h3>

          <p>
            Simple workflows that help your team move stock
            confidently.
          </p>
        </div>

      </section>

    </div>
  );
}

