import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// Create uploads folder if missing
// ===============================
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log(" uploads folder created");
}

// Serve uploads folder publicly
app.use("/uploads", express.static(uploadDir));

// ===============================
// MongoDB Connection (Updated)
// ===============================
mongoose
  .connect("mongodb://127.0.0.1:27017/starphone")
  .then(() => console.log("📦 MongoDB Connected"))
  .catch((err) => console.log(" DB Error:", err));

// ===============================
// User Schema
// ===============================
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
});

const User = mongoose.model("User", userSchema);

// ===============================
// Product Schema
// ===============================
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
});

const Product = mongoose.model("Product", productSchema);

// ===============================
// Multer Setup (Image Upload)
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ===============================
// USER REGISTER
// ===============================
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    await User.create({ name, email, password });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// USER LOGIN
// ===============================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (password !== user.password)
      return res.status(400).json({ message: "Incorrect password" });

    res.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// ADMIN LOGIN
// ===============================
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin)
      return res.status(400).json({ message: "Admin not found" });

    if (password !== admin.password)
      return res.status(400).json({ message: "Incorrect password" });

    res.json({
      message: "Admin login successful",
      admin: {
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// CREATE DEFAULT ADMIN
// ===============================
const createAdmin = async () => {
  const exist = await User.findOne({ email: "adgaurav@gmail.com" });

  if (!exist) {
    await User.create({
      name: "Super Admin",
      email: "adgaurav@gmail.com",
      password: "adg123",
      role: "admin",
    });

    console.log("⭐ Default Admin Created: adgaurav@gmail.com / adg123");
  }
};
createAdmin();

// ===============================
// GET ALL PRODUCTS
// ===============================
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ===============================
// ADD PRODUCT WITH IMAGE
// ===============================
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const product = await Product.create({
      name,
      price,
      description,
      image: imagePath,
    });

    res.json({ message: "Product added", product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding product" });
  }
});

// ===============================
// DELETE PRODUCT WITH IMAGE DELETE
// ===============================
app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product?.image) {
      const imgPath = path.join(process.cwd(), product.image.replace(/^\//, ""));
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting product" });
  }
});

// ===============================
// RUN SERVER
// ===============================
app.listen(5000, () =>
  console.log("🚀 Server running at http://localhost:5000")
);
