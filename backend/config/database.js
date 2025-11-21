const mysql = require("mysql2");
require("dotenv").config();

// Database configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "arna_user",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "arna_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    console.error("Database config:", {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      hasPassword: !!process.env.DB_PASSWORD,
    });
  } else {
    console.log("✅ Database connection successful");
    connection.release();
  }
});

const promisePool = pool.promise();

// Create missing tables function
const createMissingTables = async () => {
  try {
    console.log("🔄 Creating missing tables...");

    // Newsletter subscriptions table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        unsubscribed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Footer info table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS footer_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        logo_description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // News insight content table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS news_insight_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // News insight articles table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS news_insight_articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        button_text VARCHAR(100),
        button_link VARCHAR(255),
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Preserve conserve content table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS preserve_conserve_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        description TEXT,
        background_image_url VARCHAR(500),
        button_text VARCHAR(100) DEFAULT 'Discover More',
        button_link VARCHAR(255) DEFAULT '#',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Preserve conserve features table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS preserve_conserve_features (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon_url VARCHAR(500),
        sort_order INT DEFAULT 0,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Global presence content table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS global_presence_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Map points table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS map_points (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        marker_type VARCHAR(50) DEFAULT 'default',
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Value content table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS value_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subtitle VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Value statistics table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS value_statistics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        percentage INT NOT NULL,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Lets be great content table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS lets_be_great_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subtitle VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        button_text VARCHAR(100),
        button_link VARCHAR(255),
        background_image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Lets be great statistics table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS lets_be_great_statistics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        percentage INT NOT NULL,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Newsletter table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS newsletter (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        description TEXT,
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Missing tables created successfully");
  } catch (error) {
    console.error("❌ Error creating missing tables:", error);
    throw error;
  }
};

// Sample data insertion function
const insertSampleData = async () => {
  try {
    // Hero slides sample data
    const [heroSlidesCount] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM hero_slides"
    );
    if (heroSlidesCount[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO hero_slides (title, subtitle, content, button_text, button_link, slide_order, is_active) VALUES
        ('Meeting Future Demand In A Sustainable Way', 'WE\'RE DOING OUR PART IN THAT REGARD WITH GREENER PRACTICES THAT DON\'T HARM THE ENVIRONMENT.', 'Leading the future of energy with sustainable solutions that power the world while protecting our environment.', 'DISCOVER MORE', '#about', 1, TRUE)
      `);
      console.log("✅ Hero slides sample data inserted");
    }

    // Newsletter subscriptions sample data
    const [newsletterSubsCount] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM newsletter_subscriptions"
    );
    if (newsletterSubsCount[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO newsletter_subscriptions (email, is_active) VALUES
        ('test@example.com', TRUE)
      `);
      console.log("✅ Newsletter subscriptions sample data inserted");
    }

    // Footer info sample data
    const [footerInfoCount] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM footer_info"
    );
    if (footerInfoCount[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO footer_info (logo_description, is_active) VALUES
        ('ARNA Energy - Leading the future of sustainable energy solutions', TRUE)
      `);
      console.log("✅ Footer info sample data inserted");
    }

    // News insight content sample data
    const [newsContentCount] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM news_insight_content"
    );
    if (newsContentCount[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO news_insight_content (title, subtitle, description, is_active) VALUES
        ('Latest News & Insights', 'Stay updated with the latest developments in sustainable energy', 'Discover the latest trends, innovations, and insights in the energy sector.', TRUE)
      `);
      console.log("✅ News insight content sample data inserted");
    }

    // News insight articles sample data
    const [newsArticlesCount] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM news_insight_articles"
    );
    if (newsArticlesCount[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO news_insight_articles (title, description, button_text, button_link, display_order, is_active) VALUES
        ('Renewable Energy Trends 2024', 'Exploring the latest trends in renewable energy technology and implementation.', 'Read More', '#', 1, TRUE),
        ('Sustainable Energy Solutions', 'How we are implementing sustainable energy solutions for a better future.', 'Learn More', '#', 2, TRUE),
        ('Energy Transition Strategies', 'Strategic approaches to energy transition and sustainability.', 'Discover', '#', 3, TRUE),
        ('Green Technology Innovations', 'Latest innovations in green technology and their impact.', 'Explore', '#', 4, TRUE)
      `);
      console.log("✅ News insight articles sample data inserted");
    }

    // Preserve conserve content sample data
    const [preserveContentCount] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM preserve_conserve_content"
    );
    if (preserveContentCount[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO preserve_conserve_content (title, subtitle, description, is_active) VALUES
        ('Preserve & Conserve', 'Protecting our planet for future generations', 'We are committed to preserving and conserving our natural resources through sustainable practices and innovative solutions.', TRUE)
      `);
      console.log("✅ Preserve conserve content sample data inserted");
    }

    // Preserve conserve features sample data
    const [preserveFeaturesCount] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM preserve_conserve_features"
    );
    if (preserveFeaturesCount[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO preserve_conserve_features (title, description, icon, display_order, is_active) VALUES
        ('Environmental Protection', 'Implementing measures to protect and preserve our environment.', '🌱', 1, TRUE),
        ('Resource Conservation', 'Efficient use and conservation of natural resources.', '♻️', 2, TRUE),
        ('Sustainable Practices', 'Adopting sustainable practices in all our operations.', '🌍', 3, TRUE)
      `);
      console.log("✅ Preserve conserve features sample data inserted");
    }

    // Global presence content sample data
    const [globalContentCount] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM global_presence_content"
    );
    if (globalContentCount[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO global_presence_content (title, subtitle, description, is_active) VALUES
        ('Global Presence', 'Serving communities worldwide', 'Our operations span across multiple continents, bringing sustainable energy solutions to communities around the globe.', TRUE)
      `);
      console.log("✅ Global presence content sample data inserted");
    }

    // Map points sample data
    const [mapPointsCount] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM map_points"
    );
    if (mapPointsCount[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO map_points (title, description, latitude, longitude, marker_type, display_order, is_active) VALUES
        ('North America', 'Our operations in North America', 40.7128, -74.0060, 'office', 1, TRUE),
        ('Europe', 'European headquarters and operations', 51.5074, -0.1278, 'office', 2, TRUE),
        ('Asia Pacific', 'Asia Pacific regional operations', 35.6762, 139.6503, 'office', 3, TRUE),
        ('Middle East', 'Middle East operations center', 25.2048, 55.2708, 'office', 4, TRUE)
      `);
      console.log("✅ Map points sample data inserted");
    }

    // Value content sample data
    const [valueContentCount] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM value_content"
    );
    if (valueContentCount[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO value_content (subtitle, title, description, is_active) VALUES
        ('Our Values', 'What Drives Us Forward', 'Our core values guide everything we do, from innovation to sustainability, ensuring we deliver excellence in every project.', TRUE)
      `);
      console.log("✅ Value content sample data inserted");
    }

    // Value statistics sample data
    const [valueStatsCount] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM value_statistics"
    );
    if (valueStatsCount[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO value_statistics (title, percentage, display_order, is_active) VALUES
        ('Innovation', 95, 1, TRUE),
        ('Sustainability', 98, 2, TRUE),
        ('Excellence', 92, 3, TRUE)
      `);
      console.log("✅ Value statistics sample data inserted");
    }

    // Lets be great content sample data
    const [letsBeGreatContentCount] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM lets_be_great_content"
    );
    if (letsBeGreatContentCount[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO lets_be_great_content (subtitle, title, description, button_text, button_link, is_active) VALUES
        ('Join Us', 'Let\'s Be Great Together', 'Join us in our mission to create a sustainable energy future. Together, we can make a difference.', 'Get Started', '#contact', TRUE)
      `);
      console.log("✅ Lets be great content sample data inserted");
    }

    // Lets be great statistics sample data
    const [letsBeGreatStatsCount] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM lets_be_great_statistics"
    );
    if (letsBeGreatStatsCount[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO lets_be_great_statistics (title, percentage, display_order, is_active) VALUES
        ('Team Collaboration', 96, 1, TRUE),
        ('Client Satisfaction', 94, 2, TRUE),
        ('Project Success', 97, 3, TRUE)
      `);
      console.log("✅ Lets be great statistics sample data inserted");
    }

    // Newsletter sample data
    const [newsletterCount] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM newsletter"
    );
    if (newsletterCount[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO newsletter (title, subtitle, description, is_active) VALUES
        ('Stay Connected', 'Subscribe to our newsletter', 'Get the latest updates on sustainable energy solutions and industry insights delivered to your inbox.', TRUE)
      `);
      console.log("✅ Newsletter sample data inserted");
    }

    // FAQ sample data
    const [faqCount] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM faq"
    );
    if (faqCount[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO faq (question, answer, display_order, is_active) VALUES
        ('Hangi ülkelerle çalışıyorsunuz?', 'Başta Türkiye ve Almanya olmak üzere, Fransa, İngiltere, İtalya, Portekiz, Hindistan, Mısır, Güney Afrika, Amerika, Kanada, Güney Amerika ülkeleri ve uzak doğu ülkeleri.', 1, TRUE),
        ('Ürünlerinizin uluslararası üretim sertifikaları var mı?', 'Evet, tüm ürünlerimiz uluslararası standartlara uygun olarak üretilmekte ve gerekli sertifikalara sahiptir. ISO 9001, ISO 14001 ve diğer uluslararası kalite standartlarına uygunluk belgelerimiz mevcuttur.', 2, TRUE),
        ('Hangi alanda inşaat hizmetleri sağlıyorsunuz?', 'Petrol ve doğalgaz sektöründe kapsamlı inşaat hizmetleri sunuyoruz. Rafineri tesisleri, boru hatları, depolama tankları, işleme tesisleri ve enerji altyapı projelerinde uzmanız.', 3, TRUE),
        ('Projelerinizde hangi teknolojileri kullanıyorsunuz?', 'En son teknolojileri kullanarak projelerimizi gerçekleştiriyoruz. CCUS teknolojisi, yenilenebilir enerji sistemleri, akıllı grid teknolojileri ve sürdürülebilir enerji çözümleri alanlarında uzmanız.', 4, TRUE),
        ('Çevre dostu uygulamalarınız nelerdir?', 'Sürdürülebilir enerji çözümleri geliştiriyor, karbon ayak izimizi minimize ediyor ve çevre dostu teknolojiler kullanıyoruz. Tüm projelerimizde çevresel etki değerlendirmesi yapıyoruz.', 5, TRUE)
      `);
      console.log("✅ FAQ sample data inserted");
    }

    // FAQ content sample data
    const [faqContentCount] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM faq_content"
    );
    if (faqContentCount[0].count === 0) {
      await promisePool.execute(`
        INSERT INTO faq_content (title, subtitle, image_url, is_active) VALUES
        ('Merak Edilen Sorular', 'Size yardımcı olmak için buradayız', 'https://via.placeholder.com/400x300/c5a572/ffffff?text=FAQ+Image', TRUE)
      `);
      console.log("✅ FAQ content sample data inserted");
    }
  } catch (error) {
    console.error("❌ Sample data insertion failed:", error);
  }
};

// Database initialization
const initializeDatabase = async () => {
  try {
    console.log("🔄 Initializing database...");

    // Admins table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Hero slides table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS hero_slides (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        content TEXT,
        button_text VARCHAR(255),
        button_link VARCHAR(255),
        image_url VARCHAR(500),
        slide_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Brand trust content table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS brand_trust_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Brand trust logos table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS brand_trust_logos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        brand_name VARCHAR(255) NOT NULL,
        logo_url VARCHAR(500),
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Who we are content table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS who_we_are_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        description TEXT,
        highlight_text VARCHAR(255),
        button_text VARCHAR(100),
        button_link VARCHAR(255),
        video_url VARCHAR(500),
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Who we are features table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS who_we_are_features (
        id INT AUTO_INCREMENT PRIMARY KEY,
        feature_text VARCHAR(255) NOT NULL,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // FAQ table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS faq (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // FAQ content table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS faq_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255) DEFAULT NULL,
        image_url VARCHAR(500) DEFAULT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Project details table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS project_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content_sections JSON,
        image_url VARCHAR(500) DEFAULT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `);

    // News insight details table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS news_insight_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content_sections JSON,
        image_url VARCHAR(500) DEFAULT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES news_insight_articles(id) ON DELETE CASCADE
      )
    `);

    // Default admin user
    const [adminRows] = await pool.execute(
      "SELECT * FROM admins WHERE username = ?",
      ["admin"]
    );

    if (adminRows.length === 0) {
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await promisePool.execute(
        "INSERT INTO admins (username, email, password, is_active) VALUES (?, ?, ?, ?)",
        ["admin", "admin@arnaenergy.com", hashedPassword, true]
      );
      console.log(
        "✅ Default admin user created (username: admin, password: admin123)"
      );
    }

    // Create missing tables for admin functionality
    await createMissingTables();

    // Sample data ekle
    await insertSampleData();

    console.log("✅ Database initialization completed");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
};

module.exports = { pool: promisePool, initializeDatabase };
