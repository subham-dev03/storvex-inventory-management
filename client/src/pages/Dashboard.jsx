import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  DollarSign,
  ShoppingCart,
  Truck,
  PackageCheck
} from "lucide-react";
import api from "../services/api";

const money = n =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(n || 0);

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get("/dashboard")
      .then(r => setData(r.data))
      .catch(() => {});
  }, []);

  if (!data) return <PageLoader />;

  const { stats, lowStock } = data;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">OVERVIEW</div>

          <h1>Dashboard</h1>

          <p>
            Here’s what’s happening across your inventory today.
          </p>
        </div>

        <span className="live-pill">
          <i /> Live data
        </span>
      </div>

      <div className="stat-grid">
        <Stat
          icon={Boxes}
          label="Products"
          value={stats.totalProducts}
          hint={`${stats.lowStockCount} need attention`}
        />

        <Stat
          icon={PackageCheck}
          label="Units in stock"
          value={stats.totalStock.toLocaleString()}
          hint="Across active products"
        />

        <Stat
          icon={DollarSign}
          label="Inventory value"
          value={money(stats.inventoryValue)}
          hint="At cost price"
        />

        <Stat
          icon={ShoppingCart}
          label="Sales revenue"
          value={money(stats.salesRevenue)}
          hint={`${stats.orders} orders recorded`}
        />
      </div>

      <div className="content-grid">
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Low stock alerts</h2>

              <p>
                Items at or below their reorder level.
              </p>
            </div>

            <AlertTriangle size={20} />
          </div>

          {lowStock.length ? (
            <div className="alert-list">
              {lowStock.map(p => (
                <div
                  className="stock-row"
                  key={p._id}
                >
                  <div className="product-mini">
                    <span className="product-icon">
                      <Boxes size={17} />
                    </span>

                    <div>
                      <strong>{p.name}</strong>

                      <small>
                        {p.sku} · {p.category}
                      </small>
                    </div>
                  </div>

                  <span
                    className={
                      p.quantity === 0
                        ? "badge danger"
                        : "badge warning"
                    }
                  >
                    {p.quantity === 0
                      ? "Out of stock"
                      : `${p.quantity} left`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">
              Great! No products need restocking.
            </div>
          )}
        </section>

        <section className="card quick">
          <div className="card-head">
            <div>
              <h2>Quick insights</h2>

              <p>
                Keep your operation moving.
              </p>
            </div>
          </div>

          <div className="insight">
            <Truck />

            <div>
              <strong>{stats.suppliers}</strong>

              <span>Active suppliers</span>
            </div>
          </div>

          <div className="insight">
            <ShoppingCart />

            <div>
              <strong>{stats.orders}</strong>

              <span>Sales orders</span>
            </div>
          </div>

          <div className="insight">
            <AlertTriangle />

            <div>
              <strong>{stats.lowStockCount}</strong>

              <span>Low stock items</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={20} />
      </div>

      <small>{label}</small>

      <strong>{value}</strong>

      <span>{hint}</span>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="center-page">
      <div className="loader" />
    </div>
  );
}