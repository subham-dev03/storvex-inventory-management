import Supplier from "../models/Supplier.js";

export async function listSuppliers(req, res) {
  const suppliers = await Supplier.find().sort({ name: 1 });
  res.json({ suppliers });
}
export async function createSupplier(req, res) {
  try { res.status(201).json({ supplier: await Supplier.create(req.body) }); }
  catch (e) { res.status(400).json({ message: "Could not create supplier", error: e.message }); }
}
export async function updateSupplier(req, res) {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json({ supplier });
  } catch (e) { res.status(400).json({ message: "Could not update supplier", error: e.message }); }
}
export async function deleteSupplier(req, res) {
  const supplier = await Supplier.findByIdAndDelete(req.params.id);
  if (!supplier) return res.status(404).json({ message: "Supplier not found" });
  res.json({ message: "Supplier deleted" });
}
