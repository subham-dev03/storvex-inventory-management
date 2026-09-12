import { useEffect, useState } from "react";
import {
  Boxes,
  PackageOpen,
  Edit3,
  Plus,
  Search,
  Trash2,
  ArrowDownToLine,
  ArrowUpFromLine
} from "lucide-react";
import api from "../services/api";
import Modal from "../components/Modal";

const empty = {
  name: "",
  sku: "",
  category: "General",
  description: "",
  price: "",
  costPrice: "",
  quantity: 0,
  reorderLevel: 10
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [stock, setStock] = useState({
    type: "in",
    quantity: 1
  });
  const [busy, setBusy] = useState(false);

  const load = () =>
    api
      .get("/products", {
        params: {
          search
        }
      })
      .then(r => setProducts(r.data.products));

  useEffect(() => {
    load();

    api
      .get("/suppliers")
      .then(r => setSuppliers(r.data.suppliers));
  }, [search]);

  function start(p = null) {
    setEditing(p);

    setForm(
      p
        ? {
            ...p,
            supplier: p.supplier?._id || ""
          }
        : empty
    );

    setOpen(true);
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        costPrice: Number(form.costPrice || 0),
        quantity: Number(form.quantity),
        reorderLevel: Number(form.reorderLevel),
        supplier: form.supplier || null
      };

      if (editing) {
        await api.patch(
          `/products/${editing._id}`,
          payload
        );
      } else {
        await api.post(
          "/products",
          payload
        );
      }

      setOpen(false);
      load();
    } catch (e) {
      alert(
        e.response?.data?.message ||
        "Save failed"
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (confirm("Archive this product?")) {
      await api.delete(
        `/products/${id}`
      );

      load();
    }
  }

  async function adjust(e) {
    e.preventDefault();

    try {
      await api.post(
        `/products/${stockOpen._id}/stock`,
        {
          type: stock.type,
          quantity: Number(stock.quantity)
        }
      );

      setStockOpen(false);
      load();
    } catch (e) {
      alert(
        e.response?.data?.message ||
        "Adjustment failed"
      );
    }
  }

  return (
    <div className="page">

      <div className="page-head">

        <div>
          <div className="eyebrow">
            CATALOG
          </div>

          <h1>
            Products
          </h1>

          <p>
            Manage your product catalog and stock levels.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => start()}
        >
          <Plus size={17} />
          Add product
        </button>

      </div>

      <div className="toolbar">

        <div className="search">
          <Search size={17} />

          <input
            placeholder="Search by name or SKU..."
            value={search}
            onChange={e =>
              setSearch(e.target.value)
            }
          />
        </div>

        <span className="result-count">
          {products.length} products
        </span>

      </div>

      <div className="table-card">

        <table>

          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Supplier</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {products.map(p => (
              <tr key={p._id}>

                <td data-label="Product">
                  <div className="product-mini">

                    <span className="product-icon">
                      <Boxes size={16} />
                    </span>

                    <strong>
                      {p.name}
                    </strong>

                  </div>
                </td>

                <td data-label="SKU">
                  <code>
                    {p.sku}
                  </code>
                </td>

                <td data-label="Category">
                  {p.category}
                </td>

                <td data-label="Price">
                  ${Number(p.price).toFixed(2)}
                </td>

                <td data-label="Stock">

                  <span
                    className={
                      p.quantity <= p.reorderLevel
                        ? "stock-low"
                        : "stock-ok"
                    }
                  >
                    {p.quantity}
                  </span>

                </td>

                <td data-label="Supplier">
                  {p.supplier?.name || "—"}
                </td>

                <td>

                  <div className="row-actions">

                    <button
                      title="Stock in"
                      onClick={() => {
                        setStockOpen(p);
                        setStock({
                          type: "in",
                          quantity: 1
                        });
                      }}
                    >
                      <ArrowDownToLine size={16} />
                    </button>

                    <button
                      title="Stock out"
                      onClick={() => {
                        setStockOpen(p);
                        setStock({
                          type: "out",
                          quantity: 1
                        });
                      }}
                    >
                      <ArrowUpFromLine size={16} />
                    </button>

                    <button
                      title="Edit product"
                      onClick={() => start(p)}
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      title="Delete product"
                      onClick={() =>
                        remove(p._id)
                      }
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </td>

              </tr>
            ))}

            {!products.length && (
              <tr className="no-products-row">

                <td colSpan="7">

                  <div className="products-empty">

                    <div className="products-empty-icon">
                      <PackageOpen
                        size={38}
                        strokeWidth={1.8}
                      />
                    </div>

                    <h3>
                      No products found
                    </h3>

                    <p>
                      {search
                        ? `No products match "${search}". Try a different name or SKU.`
                        : "Your product catalog is empty. Add your first product to get started."}
                    </p>

                    {!search && (
                      <button
                        type="button"
                        className="btn btn-primary products-empty-btn"
                        onClick={() => start()}
                      >
                        <Plus size={18} />
                        Add product
                      </button>
                    )}

                  </div>

                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={
          editing
            ? "Edit product"
            : "Add product"
        }
      >

        <form
          className="modal-form"
          onSubmit={save}
        >

          <div className="form-grid">

            <label>
              Product name

              <input
                required
                value={form.name}
                onChange={e =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
              />
            </label>

            <label>
              SKU

              <input
                required
                value={form.sku}
                onChange={e =>
                  setForm({
                    ...form,
                    sku: e.target.value
                  })
                }
              />
            </label>

            <label>
              Category

              <input
                value={form.category}
                onChange={e =>
                  setForm({
                    ...form,
                    category: e.target.value
                  })
                }
              />
            </label>

            <label>
              Supplier

              <select
                value={form.supplier || ""}
                onChange={e =>
                  setForm({
                    ...form,
                    supplier: e.target.value
                  })
                }
              >

                <option value="">
                  No supplier
                </option>

                {suppliers.map(s => (
                  <option
                    key={s._id}
                    value={s._id}
                  >
                    {s.name}
                  </option>
                ))}

              </select>

            </label>

            <label>
              Sell price

              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={form.price}
                onChange={e =>
                  setForm({
                    ...form,
                    price: e.target.value
                  })
                }
              />
            </label>

            <label>
              Cost price

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.costPrice}
                onChange={e =>
                  setForm({
                    ...form,
                    costPrice: e.target.value
                  })
                }
              />
            </label>

            <label>
              Quantity

              <input
                type="number"
                min="0"
                required
                value={form.quantity}
                onChange={e =>
                  setForm({
                    ...form,
                    quantity: e.target.value
                  })
                }
              />
            </label>

            <label>
              Reorder level

              <input
                type="number"
                min="0"
                required
                value={form.reorderLevel}
                onChange={e =>
                  setForm({
                    ...form,
                    reorderLevel: e.target.value
                  })
                }
              />
            </label>

          </div>

          <label>
            Description

            <textarea
              value={form.description}
              onChange={e =>
                setForm({
                  ...form,
                  description: e.target.value
                })
              }
            />
          </label>

          <button
            className="btn btn-primary btn-full"
            disabled={busy}
          >
            {busy
              ? "Saving..."
              : "Save product"}
          </button>

        </form>

      </Modal>

      <Modal
        open={!!stockOpen}
        onClose={() => setStockOpen(false)}
        title={`Adjust stock · ${stockOpen?.name || ""}`}
      >

        <form
          className="modal-form"
          onSubmit={adjust}
        >

          <label>
            Movement

            <select
              value={stock.type}
              onChange={e =>
                setStock({
                  ...stock,
                  type: e.target.value
                })
              }
            >
              <option value="in">
                Stock in
              </option>

              <option value="out">
                Stock out
              </option>
            </select>

          </label>

          <label>
            Quantity

            <input
              type="number"
              min="1"
              required
              value={stock.quantity}
              onChange={e =>
                setStock({
                  ...stock,
                  quantity: e.target.value
                })
              }
            />

          </label>

          <button className="btn btn-primary btn-full">
            Apply adjustment
          </button>

        </form>

      </Modal>

    </div>
  );
}