const express = require("express");
const { pool } = require("../config/database");
const { authenticateToken } = require("../middleware/auth");
const { uploadSingle, handleUploadError } = require("../middleware/upload");

const router = express.Router();

// Helper function to clean and normalize image URLs
const cleanImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  // If it's already a Cloudinary URL, return as is
  if (imageUrl.includes("cloudinary.com")) {
    return imageUrl;
  }

  // If it's already a full URL, return as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // If it's a relative path starting with /uploads/, convert to full URL
  if (imageUrl.startsWith("/uploads/")) {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://api.arna.one"
        : "http://localhost:5000";
    return `${baseUrl}${imageUrl}`;
  }

  // If it's just a filename, add the full path
  if (imageUrl.includes("img-") && !imageUrl.includes("/")) {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://api.arna.one"
        : "http://localhost:5000";
    return `${baseUrl}/uploads/${imageUrl}`;
  }

  return imageUrl;
};

// Public routes - frontend için
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY slide_order ASC"
    );

    // Clean image URLs to prevent CORS errors
    const cleanedRows = rows.map((slide) => ({
      ...slide,
      image_url: cleanImageUrl(slide.image_url),
    }));

    res.json(cleanedRows);
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    res.status(500).json({ error: "Failed to fetch hero slides" });
  }
});

// Admin routes - authentication gerekli
router.use(authenticateToken);

// Admin için tüm hero slides'ları getir
router.get("/admin", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM hero_slides ORDER BY slide_order ASC"
    );

    // Clean image URLs to prevent CORS errors
    const cleanedRows = rows.map((slide) => ({
      ...slide,
      image_url: cleanImageUrl(slide.image_url),
    }));

    res.json(cleanedRows);
  } catch (error) {
    console.error("Error fetching hero slides for admin:", error);
    res.status(500).json({ error: "Failed to fetch hero slides" });
  }
});

// Yeni hero slide oluştur
router.post("/", uploadSingle("image"), handleUploadError, async (req, res) => {
  try {
    const {
      title,
      subtitle,
      content,
      button_text,
      button_link,
      slide_order,
      is_active,
    } = req.body;

    let image_url = null;
    if (req.file) {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://api.arna.one"
          : "http://localhost:5000";
      image_url = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const [result] = await pool.execute(
      "INSERT INTO hero_slides (title, subtitle, content, button_text, button_link, image_url, slide_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        subtitle,
        content,
        button_text,
        button_link,
        image_url,
        slide_order || 0,
        is_active !== "false",
      ]
    );

    res.status(201).json({
      message: "Hero slide created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating hero slide:", error);
    res.status(500).json({ error: "Failed to create hero slide" });
  }
});

// Hero slide güncelle
router.put(
  "/:id",
  uploadSingle("image"),
  handleUploadError,
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        subtitle,
        content,
        button_text,
        button_link,
        slide_order,
        is_active,
      } = req.body;

      // Mevcut slide'ı kontrol et
      const [existing] = await pool.execute(
        "SELECT * FROM hero_slides WHERE id = ?",
        [id]
      );
      if (existing.length === 0) {
        return res.status(404).json({ error: "Hero slide not found" });
      }

      let image_url = existing[0].image_url;
      if (req.file) {
        const baseUrl =
          process.env.NODE_ENV === "production"
            ? "https://api.arna.one"
            : "http://localhost:5000";
        image_url = `${baseUrl}/uploads/${req.file.filename}`;
      }

      await pool.execute(
        "UPDATE hero_slides SET title = ?, subtitle = ?, content = ?, button_text = ?, button_link = ?, image_url = ?, slide_order = ?, is_active = ? WHERE id = ?",
        [
          title,
          subtitle,
          content,
          button_text,
          button_link,
          image_url,
          slide_order || 0,
          is_active !== "false",
          id,
        ]
      );

      res.json({ message: "Hero slide updated successfully" });
    } catch (error) {
      console.error("Error updating hero slide:", error);
      res.status(500).json({ error: "Failed to update hero slide" });
    }
  }
);

// Hero slide sil
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM hero_slides WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Hero slide not found" });
    }

    res.json({ message: "Hero slide deleted successfully" });
  } catch (error) {
    console.error("Error deleting hero slide:", error);
    res.status(500).json({ error: "Failed to delete hero slide" });
  }
});

// Hero slide'ı aktif/pasif yap
router.patch("/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      "UPDATE hero_slides SET is_active = NOT is_active WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Hero slide not found" });
    }

    res.json({ message: "Hero slide status toggled successfully" });
  } catch (error) {
    console.error("Error toggling hero slide:", error);
    res.status(500).json({ error: "Failed to toggle hero slide" });
  }
});

module.exports = router;
