import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Boxes, LayoutDashboard, LogOut, ShoppingCart, Truck, Menu, X } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

const links = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/products", "Products", Boxes],
  ["/suppliers", "Suppliers", Truck],
  ["/sales", "Sales", ShoppingCart]
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <button
        // className="mobile-menu-btn" 
        className={`mobile-menu-btn ${sidebarOpen ? "menu-open" : ""}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Logo />

        <div className="workspace">WORKSPACE</div>

        <nav>
          {links.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">
              {user?.name?.[0]?.toUpperCase()}
            </div>

            <div>
              <strong>{user?.name}</strong>
              <small>{user?.role}</small>
            </div>
          </div>

          <button className="logout" onClick={handleLogout}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="mobile-header">
          <Logo />
        </header>

        <Outlet />
      </main>
    </div>
  );
}