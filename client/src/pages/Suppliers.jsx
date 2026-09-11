import { useEffect, useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Truck
} from "lucide-react";
import api from "../services/api";
import Modal from "../components/Modal";

const empty = {
  name: "",
  company: "",
  email: "",
  phone: "",
  address: "",
  notes: ""
};

export default function Suppliers() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () =>
    api
      .get("/suppliers")
      .then(r => setItems(r.data.suppliers));

  useEffect(() => {
    load();
  }, []);

  function start(x = null) {
    setEditing(x);
    setForm(x || empty);
    setOpen(true);
  }

  async function save(e) {
    e.preventDefault();

    try {
      if (editing) {
        await api.patch(
          `/suppliers/${editing._id}`,
          form
        );
      } else {
        await api.post(
          "/suppliers",
          form
        );
      }

      setOpen(false);
      load();
    } catch (e) {
      alert(
        e.response?.data?.message ||
        "Save failed"
      );
    }
  }

  async function remove(id) {
    if (confirm("Delete this supplier?")) {
      await api.delete(
        `/suppliers/${id}`
      );

      load();
    }
  }

  return (
    <div className="page">

      <div className="page-head">
        <div>
          <div className="eyebrow">
            PARTNERS
          </div>

          <h1>
            Suppliers
          </h1>

          <p>
            Keep supplier information organized and accessible.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => start()}
        >
          <Plus size={17} />
          Add supplier
        </button>
      </div>

      <div className="supplier-grid">
        {items.map(s => (
          <div
            className="supplier-card"
            key={s._id}
          >
            <div className="supplier-top">

              <span className="supplier-icon">
                <Truck size={20} />
              </span>

              <div>
                <h3>
                  {s.name}
                </h3>

                <small>
                  {s.company || "Independent supplier"}
                </small>
              </div>

              <div className="row-actions">
                <button
                  onClick={() => start(s)}
                >
                  <Edit3 size={16} />
                </button>

                <button
                  onClick={() => remove(s._id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>

            <div className="supplier-details">
              <span>
                {s.email || "No email"}
              </span>

              <span>
                {s.phone || "No phone"}
              </span>

              <span>
                {s.address || "No address"}
              </span>
            </div>
          </div>
        ))}

        {!items.length && (
          <div className="empty card">
            No suppliers yet. Add your first supplier.
          </div>
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={
          editing
            ? "Edit supplier"
            : "Add supplier"
        }
      >
        <form
          className="modal-form"
          onSubmit={save}
        >
          <div className="form-grid">

            <label>
              Name

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
              Company

              <input
                value={form.company}
                onChange={e =>
                  setForm({
                    ...form,
                    company: e.target.value
                  })
                }
              />
            </label>

            <label>
              Email

              <input
                type="email"
                value={form.email}
                onChange={e =>
                  setForm({
                    ...form,
                    email: e.target.value
                  })
                }
              />
            </label>

            <label>
              Phone

              <input
                value={form.phone}
                onChange={e =>
                  setForm({
                    ...form,
                    phone: e.target.value
                  })
                }
              />
            </label>

          </div>

          <label>
            Address

            <textarea
              value={form.address}
              onChange={e =>
                setForm({
                  ...form,
                  address: e.target.value
                })
              }
            />
          </label>

          <button className="btn btn-primary btn-full">
            Save supplier
          </button>
        </form>
      </Modal>

    </div>
  );
}