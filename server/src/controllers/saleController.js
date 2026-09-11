import Sale from "../models/Sale.js";
import Product from "../models/Product.js";

function invoice() {
  return `INV-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 90 + 10)}`;
}

export async function listSales(req, res) {
  const sales = await Sale.find()
    .populate("createdBy", "name")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ sales });
}

export async function createSale(req, res) {
  try {
    const { customerName, items = [], tax = 0, status = "paid" } = req.body;

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: "At least one item is required" });
    }

    const requestedItems = items.map((item) => ({
      product: item.product,
      quantity: Number(item.quantity)
    }));

    for (const item of requestedItems) {
      if (!item.product) {
        return res.status(400).json({ message: "Product is required for every item" });
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
    }

    const productIds = [...new Set(requestedItems.map((item) => String(item.product)))];
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    const quantityByProduct = new Map();
    for (const item of requestedItems) {
      quantityByProduct.set(
        String(item.product),
        (quantityByProduct.get(String(item.product)) || 0) + item.quantity
      );
    }

    for (const [productId, qty] of quantityByProduct) {
      const product = productMap.get(productId);
      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }
      if (product.quantity < qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}`
        });
      }
    }

    const finalItems = [];
    let subtotal = 0;

    for (const item of requestedItems) {
      const product = productMap.get(String(item.product));
      const total = item.quantity * product.price;
      subtotal += total;

      product.quantity -= item.quantity;
      await product.save();

      finalItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        quantity: item.quantity,
        unitPrice: product.price,
        total
      });
    }

    const taxAmount = Math.max(0, Number(tax) || 0);

    const created = await Sale.create({
      invoiceNumber: invoice(),
      customerName: customerName || "Walk-in customer",
      items: finalItems,
      subtotal,
      tax: taxAmount,
      total: subtotal + taxAmount,
      status,
      createdBy: req.user.id
    });

    res.status(201).json({ sale: created });
  } catch (e) {
    console.error("Create sale error:", e);
    res.status(400).json({
      message: "Could not create sale",
      error: e.message
    });
  }
}
