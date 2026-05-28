const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const bookRoutes = require("./routes/bookRoutes");
const draftRoutes = require("./routes/draftRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/drafts", draftRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});