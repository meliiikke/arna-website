import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiGet } from "../utils/api";
import { normalizeImageUrl } from "../config/api";
import "./PreserveConserve.css";

const PreserveConserve = () => {
  const [preserveConserveData, setPreserveConserveData] = useState({
    content: null,
    features: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreserveConserveData = async () => {
      try {
        setLoading(true);
        console.log("🚀 Starting PreserveConserve data fetch...");
        console.log(
          "🌐 API Base URL:",
          process.env.REACT_APP_API_BASE_URL || "https://api.arna.one/api"
        );

        // Fetch preserve conserve content from backend
        console.log("🌐 Making API call to: /api/preserve-conserve/content");
        const contentResponse = await apiGet("/api/preserve-conserve/content");
        console.log(
          "🔍 PreserveConserve content API response:",
          contentResponse
        );

        // Fetch preserve conserve features from backend
        console.log("🌐 Making API call to: /api/preserve-conserve/features");
        const featuresResponse = await apiGet(
          "/api/preserve-conserve/features"
        );
        console.log(
          "🔍 PreserveConserve features API response:",
          featuresResponse
        );

        let content = null;
        let features = [];

        // Process content data
        if (
          contentResponse &&
          !contentResponse.error &&
          contentResponse.title
        ) {
          console.log(
            "✅ PreserveConserve content loaded from backend:",
            contentResponse
          );
          content = contentResponse;
        } else {
          console.log("⚠️ No content from backend, using fallback data");
          content = {
            id: 1,
            title: "A Vital Energy Resource For A Better Tomorrow",
            subtitle: "PRESERVE AND CONSERVE",
            description:
              "Cubilia scelerisque ultricies at cras tempus phasellus primis habitant. Penatibus pulvinar at vel cursus dignissim sem condimentum molestie. Lobortis hac aenean posuere justo letius laoreet augue.",
            background_image_url: require("../images/mission.jpg"),
            button_text: "Discover More →",
            button_link: "#",
            is_active: 1,
          };
        }

        // Process features data
        if (
          featuresResponse &&
          !featuresResponse.error &&
          Array.isArray(featuresResponse) &&
          featuresResponse.length > 0
        ) {
          console.log(
            "✅ PreserveConserve features loaded from backend:",
            featuresResponse
          );
          features = featuresResponse;
        } else {
          console.log("⚠️ No features from backend, using fallback data");
          features = [
            {
              id: 1,
              title: "Motto",
              description:
                "Metus montes cras massa venenatis id dignissim suspendisse purus nibh. Mollis sapien facilisis luctus.",
              icon_url: null,
              display_order: 1,
              is_active: 1,
            },
            {
              id: 2,
              title: "Vision",
              description:
                "Metus montes cras massa venenatis id dignissim suspendisse purus nibh. Mollis sapien facilisis luctus.",
              icon_url: null,
              display_order: 2,
              is_active: 1,
            },
            {
              id: 3,
              title: "Mission",
              description:
                "Metus montes cras massa venenatis id dignissim suspendisse purus nibh. Mollis sapien facilisis luctus.",
              icon_url: null,
              display_order: 3,
              is_active: 1,
            },
          ];
        }

        setPreserveConserveData({
          content: content,
          features: features,
        });

        console.log("✅ PreserveConserve data set successfully");
      } catch (error) {
        console.error("❌ Error fetching preserve conserve data:", error);
        console.error("❌ Error details:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });

        // Use fallback data on error
        console.log("⚠️ Using fallback preserve conserve data due to error");
        setPreserveConserveData({
          content: {
            id: 1,
            title: "A Vital Energy Resource For A Better Tomorrow",
            subtitle: "PRESERVE AND CONSERVE",
            description:
              "Cubilia scelerisque ultricies at cras tempus phasellus primis habitant. Penatibus pulvinar at vel cursus dignissim sem condimentum molestie. Lobortis hac aenean posuere justo letius laoreet augue.",
            background_image_url: require("../images/mission.jpg"),
            button_text: "Discover More →",
            button_link: "#",
            is_active: 1,
          },
          features: [
            {
              id: 1,
              title: "Motto",
              description:
                "Metus montes cras massa venenatis id dignissim suspendisse purus nibh. Mollis sapien facilisis luctus.",
              icon_url: null,
              display_order: 1,
              is_active: 1,
            },
            {
              id: 2,
              title: "Vision",
              description:
                "Metus montes cras massa venenatis id dignissim suspendisse purus nibh. Mollis sapien facilisis luctus.",
              icon_url: null,
              display_order: 2,
              is_active: 1,
            },
            {
              id: 3,
              title: "Mission",
              description:
                "Metus montes cras massa venenatis id dignissim suspendisse purus nibh. Mollis sapien facilisis luctus.",
              icon_url: null,
              display_order: 3,
              is_active: 1,
            },
          ],
        });
        setError(null); // Clear error since we have fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchPreserveConserveData();
  }, []);

  if (loading) {
    return (
      <section className="preserve-conserve-section">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </section>
    );
  }

  const { content, features } = preserveConserveData;

  console.log("🎯 Render - Content:", content);
  console.log("🎯 Render - Features:", features);
  console.log("🎯 Render - Features length:", features ? features.length : 0);

  if (!content) {
    return (
      <section className="preserve-conserve-section">
        <div className="container">
          <div className="error-message">{error || "No content available"}</div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="preserve-conserve-section"
      style={{
        backgroundImage: content.background_image_url
          ? `url(${normalizeImageUrl(content.background_image_url)})`
          : "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      }}
    >
      <div className="container">
        <div className="preserve-conserve-content">
          {/* Left Content Area */}
          <motion.div
            className="text-content"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="subtitle50">{content.subtitle}</div>
            <h2 className="title50">{content.title}</h2>
            <p className="description50">{content.description}</p>
            <button className="discover-button">{content.button_text}</button>
          </motion.div>

          {/* Right Content Area - Features */}
          <motion.div
            className="preserve-conserve-features"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="features-grid">
              {features && features.length > 0 ? (
                features.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    className="feature-card50"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                      ease: "easeOut",
                    }}
                    viewport={{ once: true, amount: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="feature-icon50">
                      <span>→</span>
                    </div>
                    <div className="feature-content">
                      <h3 className="feature-title50">{feature.title}</h3>
                      <p className="feature-description50">
                        {feature.description ||
                          "Click edit to add description..."}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="empty-features">
                  <p>
                    No features available. Please add features through the admin
                    panel.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PreserveConserve;
