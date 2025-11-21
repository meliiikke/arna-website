const express = require("express");
const cors = require("cors");
const { pool } = require("../config/database");
const { authenticateToken } = require("../middleware/auth");
const { uploadSingle, handleUploadError } = require("../middleware/upload");

const router = express.Router();

router.use(
  cors({
    origin: [
      "https://arna.one",
      "https://www.arna.one",
      "https://api.arna.one",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

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

  // If it's a full server path with /uploads/, extract the relative path
  if (imageUrl.includes("/uploads/")) {
    const relativePath = imageUrl.substring(imageUrl.indexOf("/uploads/"));
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://api.arna.one"
        : "http://localhost:5000";
    return `${baseUrl}${relativePath}`;
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

// PUBLIC ROUTES - Frontend için

// Get value section content (public)
router.get("/content", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM value_content ORDER BY created_at DESC LIMIT 1"
    );

    if (rows.length === 0) {
      return res.json({
        id: null,
        subtitle: "OUR VALUE",
        title: "Promoting responsible use of petroleum resources",
        description:
          "Habitant mollis mauris natoque justo hac nibh convallis fermentum integer turpis quisque. Adipiscing vulputate malesuada commodo nisl massa vestibulum habitant mus in elementum. Venenatis aptent sodales dapibus justo nam interdum neque.",
        image_url: null,
        is_active: true,
      });
    }

    const content = {
      ...rows[0],
      image_url: cleanImageUrl(rows[0].image_url),
    };

    console.log("🔍 Value Section Content:", {
      id: content.id,
      subtitle: content.subtitle,
      title: content.title,
      image_url: content.image_url,
      original_image_url: rows[0].image_url,
      cleanImageUrl_result: cleanImageUrl(rows[0].image_url),
    });

    res.json(content);
  } catch (error) {
    console.error("Error fetching value content:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get value section statistics (public)
router.get("/statistics", async (req, res) => {
  try {
    console.log("🔍 Fetching value statistics from database...");
    const [rows] = await pool.execute(
      "SELECT * FROM value_statistics WHERE is_active = true ORDER BY display_order ASC"
    );

    console.log("🔍 Value statistics query result:", rows);
    console.log("🔍 Number of rows found:", rows.length);

    if (rows.length === 0) {
      console.log(
        "⚠️ No statistics found in database, returning fallback data"
      );
      return res.json([
        {
          id: 1,
          title: "Cleaner",
          percentage: 90,
          display_order: 1,
          is_active: true,
        },
        {
          id: 2,
          title: "Stronger",
          percentage: 75,
          display_order: 2,
          is_active: true,
        },
        {
          id: 3,
          title: "Better",
          percentage: 82,
          display_order: 3,
          is_active: true,
        },
      ]);
    }

    console.log("✅ Returning statistics from database:", rows);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching value statistics:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get complete value section data (public)
router.get("/", async (req, res) => {
  try {
    // Get content
    const [contentRows] = await pool.execute(
      "SELECT * FROM value_content WHERE is_active = true ORDER BY created_at DESC LIMIT 1"
    );

    // Get statistics
    const [statRows] = await pool.execute(
      "SELECT * FROM value_statistics WHERE is_active = true ORDER BY display_order ASC"
    );

    const content =
      contentRows.length > 0
        ? {
            ...contentRows[0],
            image_url: cleanImageUrl(contentRows[0].image_url),
          }
        : {
            id: null,
            subtitle: "OUR VALUE",
            title: "Promoting responsible use of petroleum resources",
            description:
              "Habitant mollis mauris natoque justo hac nibh convallis fermentum integer turpis quisque. Adipiscing vulputate malesuada commodo nisl massa vestibulum habitant mus in elementum. Venenatis aptent sodales dapibus justo nam interdum neque.",
            image_url: null,
            is_active: true,
          };

    const statistics =
      statRows.length > 0
        ? statRows
        : [
            {
              id: 1,
              title: "Cleaner",
              percentage: 90,
              display_order: 1,
              is_active: true,
            },
            {
              id: 2,
              title: "Stronger",
              percentage: 75,
              display_order: 2,
              is_active: true,
            },
            {
              id: 3,
              title: "Better",
              percentage: 82,
              display_order: 3,
              is_active: true,
            },
          ];

    res.json({
      content,
      statistics,
    });
  } catch (error) {
    console.error("Error fetching value section data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ADMIN ROUTES - Authentication required

// Get all value content for admin (including inactive)
router.get("/admin/content", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM value_content ORDER BY created_at DESC"
    );

    const cleanedRows = rows.map((content) => ({
      ...content,
      image_url: cleanImageUrl(content.image_url),
    }));

    res.json(cleanedRows);
  } catch (error) {
    console.error("Error fetching value content for admin:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all value statistics for admin (including inactive)
router.get("/admin/statistics", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM value_statistics ORDER BY display_order ASC"
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching value statistics for admin:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get complete value section data for admin
router.get("/admin", authenticateToken, async (req, res) => {
  try {
    // Get all content
    const [contentRows] = await pool.execute(
      "SELECT * FROM value_content ORDER BY created_at DESC"
    );

    // Get all statistics
    const [statRows] = await pool.execute(
      "SELECT * FROM value_statistics ORDER BY display_order ASC"
    );

    const cleanedContent = contentRows.map((content) => ({
      ...content,
      image_url: cleanImageUrl(content.image_url),
    }));

    res.json({
      content: cleanedContent,
      statistics: statRows,
    });
  } catch (error) {
    console.error("Error fetching value section data for admin:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create value content
router.post("/admin/content", uploadSingle("image"), async (req, res) => {
  try {
    const { subtitle, title, description, is_active } = req.body;
    const image_url = req.file ? req.file.path : null;

    const [result] = await pool.execute(
      "INSERT INTO value_content (subtitle, title, description, image_url, is_active) VALUES (?, ?, ?, ?, ?)",
      [
        subtitle || "OUR VALUE",
        title,
        description || "",
        image_url,
        is_active !== undefined ? is_active : true,
      ]
    );

    res.json({
      message: "Value content created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating value content:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update value content
router.put("/admin/content/:id", uploadSingle("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { subtitle, title, description, is_active } = req.body;
    const image_url = req.file ? req.file.path : undefined;

    // Build dynamic query based on provided fields
    let query = "UPDATE value_content SET ";
    const params = [];
    const updates = [];

    if (subtitle !== undefined) {
      updates.push("subtitle = ?");
      params.push(subtitle);
    }
    if (title !== undefined) {
      updates.push("title = ?");
      params.push(title);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      params.push(description);
    }
    if (image_url !== undefined) {
      updates.push("image_url = ?");
      params.push(image_url);
    }
    if (is_active !== undefined) {
      updates.push("is_active = ?");
      params.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    query += updates.join(", ") + " WHERE id = ?";
    params.push(id);

    const [result] = await pool.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Value content not found" });
    }

    res.json({
      message: "Value content updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error updating value content:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete value content
router.delete("/admin/content/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM value_content WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Value content not found" });
    }

    res.json({
      message: "Value content deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error deleting value content:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create value statistic
router.post("/admin/statistics", async (req, res) => {
  try {
    const { title, percentage, display_order, is_active } = req.body;

    const [result] = await pool.execute(
      "INSERT INTO value_statistics (title, percentage, display_order, is_active) VALUES (?, ?, ?, ?)",
      [
        title,
        percentage || 0,
        display_order || 1,
        is_active !== undefined ? is_active : true,
      ]
    );

    res.json({
      message: "Value statistic created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating value statistic:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update value statistic
router.put("/admin/statistics/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, percentage, display_order, is_active } = req.body;

    // Build dynamic query based on provided fields
    let query = "UPDATE value_statistics SET ";
    const params = [];
    const updates = [];

    if (title !== undefined) {
      updates.push("title = ?");
      params.push(title);
    }
    if (percentage !== undefined) {
      updates.push("percentage = ?");
      params.push(percentage);
    }
    if (display_order !== undefined) {
      updates.push("display_order = ?");
      params.push(display_order);
    }
    if (is_active !== undefined) {
      updates.push("is_active = ?");
      params.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    query += updates.join(", ") + " WHERE id = ?";
    params.push(id);

    const [result] = await pool.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Value statistic not found" });
    }

    res.json({
      message: "Value statistic updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error updating value statistic:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete value statistic
router.delete("/admin/statistics/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM value_statistics WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Value statistic not found" });
    }

    res.json({
      message: "Value statistic deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error deleting value statistic:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Bulk update statistics display order
router.put("/admin/statistics/order", async (req, res) => {
  try {
    const { statistics } = req.body; // Array of {id, display_order}

    if (!Array.isArray(statistics)) {
      return res.status(400).json({ message: "Statistics must be an array" });
    }

    let updatedCount = 0;

    for (const stat of statistics) {
      if (stat.id && stat.display_order !== undefined) {
        const [result] = await pool.execute(
          "UPDATE value_statistics SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
          [stat.display_order, stat.id]
        );
        updatedCount += result.affectedRows;
      }
    }

    res.json({
      message: "Statistics order updated successfully",
      updatedCount,
    });
  } catch (error) {
    console.error("Error updating statistics order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Initialize value section with default data
router.post("/admin/initialize", authenticateToken, async (req, res) => {
  try {
    // Initialize content
    const [contentResult] = await pool.execute(
      `INSERT INTO value_content (subtitle, title, description, is_active) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       subtitle = VALUES(subtitle), 
       title = VALUES(title), 
       description = VALUES(description), 
       is_active = VALUES(is_active)`,
      [
        "OUR VALUE",
        "Promoting responsible use of petroleum resources",
        "Habitant mollis mauris natoque justo hac nibh convallis fermentum integer turpis quisque. Adipiscing vulputate malesuada commodo nisl massa vestibulum habitant mus in elementum. Venenatis aptent sodales dapibus justo nam interdum neque.",
        true,
      ]
    );

    // Initialize statistics
    const statistics = [
      { title: "Cleaner", percentage: 90, display_order: 1 },
      { title: "Stronger", percentage: 75, display_order: 2 },
      { title: "Better", percentage: 82, display_order: 3 },
    ];

    let statsCreated = 0;
    for (const stat of statistics) {
      const [statResult] = await pool.execute(
        `INSERT INTO value_statistics (title, percentage, display_order, is_active) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE 
         title = VALUES(title), 
         percentage = VALUES(percentage), 
         display_order = VALUES(display_order), 
         is_active = VALUES(is_active)`,
        [stat.title, stat.percentage, stat.display_order, true]
      );
      if (statResult.affectedRows > 0) statsCreated++;
    }

    res.json({
      message: "Value section initialized successfully",
      contentCreated: contentResult.affectedRows > 0,
      statisticsCreated: statsCreated,
    });
  } catch (error) {
    console.error("Error initializing value section:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
