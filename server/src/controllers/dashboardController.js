import Product from "../models/Product.js";
import Supplier from "../models/Supplier.js";
import Sale from "../models/Sale.js";

export async function dashboard(req, res) {
  const [products, suppliers, sales] = await Promise.all([
    Product.find({ active: true }).select("name sku category price quantity reorderLevel"),
    Supplier.countDocuments(),
    Sale.find({ status: { $ne: "cancelled" } }).select("total createdAt status").sort({ createdAt: -1 }).limit(500)
  ]);

  const totalStock = products.reduce((s, p) => s + p.quantity, 0);
  const inventoryValue = products.reduce((s, p) => s + p.quantity * p.costPrice, 0);
  const salesRevenue = sales.reduce((s, x) => s + x.total, 0);
  const lowStock = products.filter(p => p.quantity <= p.reorderLevel).sort((a,b) => a.quantity-b.quantity).slice(0, 8);

  res.json({
    stats: {
      totalProducts: products.length,
      totalStock,
      inventoryValue,
      suppliers,
      salesRevenue,
      orders: sales.length,
      lowStockCount: products.filter(p => p.quantity <= p.reorderLevel).length
    },
    lowStock
  });
}
