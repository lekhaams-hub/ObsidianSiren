// backend/middleware/requireAdmin.js
const requireAdmin = (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    const isAdmin =
      user.admin === true ||
      user.role === "admin" ||
      (user.email && adminEmails.includes(user.email.toLowerCase()));

    if (!isAdmin) {
      return res.status(403).json({ message: "Forbidden: admin only" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Admin check failed", error: error.message });
  }
};

module.exports = requireAdmin;