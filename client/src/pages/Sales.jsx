import { useEffect, useState } from "react";
import {
  Plus,
  ShoppingCart
} from "lucide-react";
import api from "../services/api";
import Modal from "../components/Modal";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState([
    {
      product: "",
      quantity: 1
    }
  ]);

  const load = () =>
    api
      .get("/sales")
      .then(r => setSales(r.data.sales));

  useEffect(() => {
    load();

    api
      .get("/products")
      .then(r => setProducts(r.data.products));
  }, []);

  function add() {
    setItems([
      ...items,
      {
        product: "",
        quantity: 1
      }
    ]);
  }

  function update(i, k, v) {
    setItems(
      items.map((x, j) =>
        j === i
          ? {
              ...x,
              [k]: v
            }
          : x
      )
    );
  }

  async function save(e) {
    e.preventDefault();

    try {
      await api.post("/sales", {
        customerName: customer,
        items: items
          .filter(x => x.product)
          .map(x => ({
            product: x.product,
            quantity: Number(x.quantity)
          }))
      });

      setOpen(false);
      setCustomer("");
      setItems([
        {
          product: "",
          quantity: 1
        }
      ]);

      load();

      api
        .get("/products")
        .then(r => setProducts(r.data.products));
    } catch (e) {
      alert(
        e.response?.data?.message ||
        "Could not create sale"
      );
    }
  }

  return (
    <div className="page">

      <div className="page-head">
        <div>
          <div className="eyebrow">
            REVENUE
          </div>

          <h1>
            Sales
          </h1>

          <p>
            Record sales and automatically deduct stock.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setOpen(true)}
        >
          <Plus size={17} />
          New sale
        </button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {sales.map(s => (
              <tr key={s._id}>
                <td>
                  <code>
                    {s.invoiceNumber}
                  </code>
                </td>

                <td>
                  {s.customerName}
                </td>

                <td>
                  {s.items.length}
                </td>

                <td>
                  ${s.total.toFixed(2)}
                </td>

                <td>
                  <span className="badge success">
                    {s.status}
                  </span>
                </td>

                <td>
                  {new Date(
                    s.createdAt
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {!sales.length && (
              <tr>
                <td colSpan="6">
                  <div className="empty">
                    No sales recorded yet.
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
        title="Record new sale"
      >
        <form
          className="modal-form"
          onSubmit={save}
        >
          <label>
            Customer name

            <input
              value={customer}
              onChange={e =>
                setCustomer(e.target.value)
              }
              placeholder="Walk-in customer"
            />
          </label>

          {items.map((x, i) => (
            <div
              className="sale-line"
              key={i}
            >
              <select
                required
                value={x.product}
                onChange={e =>
                  update(
                    i,
                    "product",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select product
                </option>

                {products
                  .filter(p => p.quantity > 0)
                  .map(p => (
                    <option
                      key={p._id}
                      value={p._id}
                    >
                      {p.name} — {p.quantity} available
                    </option>
                  ))}
              </select>

              <input
                type="number"
                min="1"
                required
                value={x.quantity}
                onChange={e =>
                  update(
                    i,
                    "quantity",
                    e.target.value
                  )
                }
              />
            </div>
          ))}

          <button
            type="button"
            className="btn btn-ghost btn-full"
            onClick={add}
          >
            + Add another item
          </button>

          <button
            className="btn btn-primary btn-full"
          >
            <ShoppingCart size={17} />
            Complete sale
          </button>
        </form>
      </Modal>

    </div>
  );
}