const express = require("express");
const { pool } = require("../config/database");
const { authenticateToken } = require("../middleware/auth");
const { uploadSingle, handleUploadError } = require("../middleware/upload");

const router = express.Router();

// Public routes
router.get("/content", async (req, res) => {
  try {
    console.log("📥 GET /api/newsletter/content - Fetching newsletter content");
    const [rows] = await pool.execute(
      "SELECT * FROM newsletter WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1"
    );

    if (rows.length === 0) {
      return res.json({
        id: null,
        title: "Newsletter",
        subtitle: "",
        description:
          "Sign up our newsletter to get update news and article about company.",
        image_url: null,
        is_active: true,
      });
    }

    const content = {
      ...rows[0],
      image_url: rows[0].image_url
        ? rows[0].image_url.startsWith("http")
          ? rows[0].image_url
          : `${
              process.env.NODE_ENV === "production"
                ? "https://api.arna.one"
                : "http://localhost:5000"
            }${rows[0].image_url}`
        : null,
    };

    console.log("✅ Newsletter content fetched:", content);
    res.json(content);
  } catch (error) {
    console.error("❌ Error fetching newsletter content:", error);
    res.status(500).json({ error: "Failed to fetch newsletter content" });
  }
});

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if email already exists
    const [existing] = await pool.execute(
      "SELECT id FROM newsletter_subscriptions WHERE email = ? AND is_active = 1",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already subscribed" });
    }

    // Insert new subscription
    const [result] = await pool.execute(
      "INSERT INTO newsletter_subscriptions (email, is_active) VALUES (?, 1)",
      [email]
    );

    console.log("✅ Newsletter subscription created:", {
      id: result.insertId,
      email,
    });
    res.json({
      message: "Successfully subscribed to newsletter",
      id: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error subscribing to newsletter:", error);
    res.status(500).json({ error: "Failed to subscribe to newsletter" });
  }
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM newsletter WHERE is_active = 1 ORDER BY id"
    );
    res.json(rows[0] || null);
  } catch (error) {
    console.error("Error fetching newsletter:", error);
    res.status(500).json({ error: "Failed to fetch newsletter" });
  }
});

// Admin routes
router.use(authenticateToken);

// Newsletter CRUD
router.get("/admin", authenticateToken, async (req, res) => {
  try {
    console.log("📥 GET /api/newsletter/admin - Fetching newsletter for admin");
    const [rows] = await pool.execute("SELECT * FROM newsletter ORDER BY id");
    console.log("✅ Newsletter fetched:", rows.length, "items");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching newsletter:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({
      error: "Failed to fetch newsletter",
      details: error.message,
    });
  }
});

router.post(
  "/admin",
  authenticateToken,
  uploadSingle("image"),
  handleUploadError,
  async (req, res) => {
    try {
      const { title, subtitle, description, is_active } = req.body;

      let image_url = null;
      if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
      }

      const [result] = await pool.execute(
        "INSERT INTO newsletter (title, subtitle, description, image_url, is_active) VALUES (?, ?, ?, ?, ?)",
        [title, subtitle, description, image_url, is_active !== false]
      );

      res.status(201).json({
        message: "Newsletter created successfully",
        id: result.insertId,
      });
    } catch (error) {
      console.error("Error creating newsletter:", error);
      res.status(500).json({ error: "Failed to create newsletter" });
    }
  }
);

router.put(
  "/admin/:id",
  authenticateToken,
  uploadSingle("image"),
  handleUploadError,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, subtitle, description, is_active } = req.body;

      // Mevcut newsletter'ı kontrol et
      const [existing] = await pool.execute(
        "SELECT * FROM newsletter WHERE id = ?",
        [id]
      );
      if (existing.length === 0) {
        return res.status(404).json({ error: "Newsletter not found" });
      }

      let image_url = existing[0].image_url;
      if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
      }

      await pool.execute(
        "UPDATE newsletter SET title = ?, subtitle = ?, description = ?, image_url = ?, is_active = ? WHERE id = ?",
        [title, subtitle, description, image_url, is_active !== false, id]
      );

      res.json({ message: "Newsletter updated successfully" });
    } catch (error) {
      console.error("Error updating newsletter:", error);
      res.status(500).json({ error: "Failed to update newsletter" });
    }
  }
);

router.delete("/admin/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute("DELETE FROM newsletter WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Newsletter not found" });
    }

    res.json({ message: "Newsletter deleted successfully" });
  } catch (error) {
    console.error("Error deleting newsletter:", error);
    res.status(500).json({ error: "Failed to delete newsletter" });
  }
});

// Newsletter Subscriptions Admin Routes
router.get("/admin/subscriptions", authenticateToken, async (req, res) => {
  try {
    console.log(
      "📥 GET /api/newsletter/admin/subscriptions - Fetching newsletter subscriptions"
    );
    const [rows] = await pool.execute(
      "SELECT * FROM newsletter_subscriptions ORDER BY subscribed_at DESC"
    );
    console.log("✅ Newsletter subscriptions fetched:", rows.length, "items");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching newsletter subscriptions:", error);
    res.status(500).json({ error: "Failed to fetch newsletter subscriptions" });
  }
});

router.delete(
  "/admin/subscriptions/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Soft delete - set is_active to 0
      const [result] = await pool.execute(
        "UPDATE newsletter_subscriptions SET is_active = 0, unsubscribed_at = CURRENT_TIMESTAMP WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Newsletter subscription not found" });
      }

      console.log("✅ Newsletter subscription soft deleted:", id);
      res.json({ message: "Newsletter subscription deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting newsletter subscription:", error);
      res
        .status(500)
        .json({ error: "Failed to delete newsletter subscription" });
    }
  }
);

module.exports = router;
