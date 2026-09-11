import Product from "../models/Product.js";

export async function listProducts(req, res) {
  try {
    const { search = "", category = "", lowStock = "" } = req.query;
    const filter = { active: true };
    if (search) filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } }
    ];
    if (category) filter.category = category;
    let products = await Product.find(filter).populate("supplier", "name company").sort({ createdAt: -1 });
    if (lowStock === "true") products = products.filter(p => p.quantity <= p.reorderLevel);
    res.json({ products });
  } catch (e) { res.status(500).json({ message: "Could not load products", error: e.message }); }
}

export async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (e) { res.status(400).json({ message: "Could not create product", error: e.message }); }
}

export async function updateProduct(req, res) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (e) { res.status(400).json({ message: "Could not update product", error: e.message }); }
}

export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product archived" });
}

export async function adjustStock(req, res) {
  try {
    const { type, quantity } = req.body;
    const amount = Number(quantity);
    if (!["in", "out"].includes(type) || !Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: "Invalid stock adjustment" });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (type === "out" && product.quantity < amount) return res.status(400).json({ message: "Insufficient stock" });
    product.quantity += type === "in" ? amount : -amount;
    await product.save();
    res.json({ product });
  } catch (e) { res.status(400).json({ message: "Stock adjustment failed", error: e.message }); }
}
