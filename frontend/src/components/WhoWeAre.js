import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiGet } from "../utils/api";
import { normalizeImageUrl } from "../config/api";
import "./WhoWeAre.css";

const WhoWeAre = () => {
  console.log("🎯 WhoWeAre component rendered");

  const [whoWeAreData, setWhoWeAreData] = useState({
    content: null,
    features: [],
  });
  const [loading, setLoading] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const fetchWhoWeAreData = async () => {
      try {
        setLoading(true);
        console.log("🚀 Starting WhoWeAre data fetch...");

        console.log("🌐 Making API call to: api/who-we-are");
        console.log(
          "🌐 API Base URL:",
          process.env.REACT_APP_API_BASE_URL || "https://api.arna.one/api"
        );

        const data = await apiGet("/api/who-we-are");

        console.log("🔍 WhoWeAre API response:", data);
        console.log("🔍 API response type:", typeof data);
        console.log(
          "🔍 API response keys:",
          data ? Object.keys(data) : "No data"
        );
        console.log(
          "🔍 API response stringified:",
          JSON.stringify(data, null, 2)
        );

        if (!data || data.error) {
          console.error("❌ WhoWeAre API error:", data?.error);
          console.error("❌ Full error response:", data);
          throw new Error("API response invalid");
        }

        console.log("✅ WhoWeAre data received:", {
          content: data.content,
          features: data.features,
          contentType: typeof data.content,
          featuresType: typeof data.features,
          featuresLength: data.features ? data.features.length : "No features",
        });

        // Set data from API response
        setWhoWeAreData({
          content: data.content || null,
          features: data.features || [],
        });

        console.log("✅ WhoWeAre state updated");
      } catch (error) {
        console.error("❌ Error fetching who we are data:", error);
        console.error("❌ Error message:", error.message);
        console.error("❌ Error stack:", error.stack);
        console.error("❌ Error response:", error.response);
        console.error("❌ Error status:", error.response?.status);
        console.error("❌ Error data:", error.response?.data);

        // Fallback data
        setWhoWeAreData({
          content: {
            id: 1,
            title: "Providing affordable and reliable energy",
            subtitle: "Who We Are",
            description:
              "Dictumst venenatis quisque erat dapibus phasellus nec. Cursus neque mattis class rutrum hendrerit quis nostra aptent parturient a. Ac laoreet aptent nec montes venenatis dis efficitur sapien ullamcorper habitasse augue.",
            highlight_text: "WE'RE NO.1 OIL & GAS COMPANY.",
            button_text: "READ MORE",
            button_link: "#services",
            video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            image_url: require("../images/about.jpg"),
            is_active: true,
          },
          features: [
            {
              id: 1,
              feature_text: "Clean energy for a bright future",
              display_order: 1,
              is_active: true,
            },
            {
              id: 2,
              feature_text: "Sustainable development",
              display_order: 2,
              is_active: true,
            },
            {
              id: 3,
              feature_text: "Improving access to energy",
              display_order: 3,
              is_active: true,
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWhoWeAreData();
  }, []);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  return (
    <section id="about" className="who-we-are">
      <div className="container">
        <div className="who-we-are-content">
          <motion.div
            className="who-we-are-text"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="who-we-are-left">
              <span className="section-subtitle">
                {whoWeAreData.content?.subtitle || "Who We Are"}
              </span>
              <h2 className="section-title">
                {whoWeAreData.content?.title ||
                  "Providing affordable and reliable energy"}
              </h2>
              <p className="section-description">
                {whoWeAreData.content?.description ||
                  "Dictumst venenatis quisque erat dapibus phasellus nec. Cursus neque mattis class rutrum hendrerit quis nostra aptent parturient a. Ac laoreet aptent nec montes venenatis dis efficitur sapien ullamcorper habitasse augue."}
              </p>
            </div>

            <div className="who-we-are-bottom">
              <div className="who-we-are-bottom-left">
                <div className="company-highlight">
                  <div className="highlight-icon">
                    <i className="fas fa-medal"></i>
                  </div>
                  <span className="highlight-text">
                    {whoWeAreData.content?.highlight_text ||
                      "We're No.1 Oil & Gas Company."}
                  </span>
                </div>
              </div>

              <div className="who-we-are-bottom-right">
                <div className="about-features">
                  {loading ? (
                    <div className="loading-features">
                      <div className="loading-spinner"></div>
                    </div>
                  ) : (
                    <>
                      {console.log("🎯 Rendering features:", {
                        loading,
                        featuresLength: whoWeAreData.features.length,
                        features: whoWeAreData.features,
                      })}
                      {whoWeAreData.features.length > 0 ? (
                        whoWeAreData.features.map((feature, index) => (
                          <div key={feature.id} className="about-feature-item">
                            <div className="feature-check">
                              <i className="fas fa-check"></i>
                            </div>
                            <span className="feature-text">
                              {feature.feature_text}
                            </span>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="about-feature-item">
                            <div className="feature-check">
                              <i className="fas fa-check"></i>
                            </div>
                            <span className="feature-text">
                              Clean energy for a bright future
                            </span>
                          </div>
                          <div className="about-feature-item">
                            <div className="feature-check">
                              <i className="fas fa-check"></i>
                            </div>
                            <span className="feature-text">
                              Sustainable development
                            </span>
                          </div>
                          <div className="about-feature-item">
                            <div className="feature-check">
                              <i className="fas fa-check"></i>
                            </div>
                            <span className="feature-text">
                              Improving access to energy
                            </span>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                <button
                  className="btn btn-primary read-more-btn"
                  onClick={() => {
                    if (whoWeAreData.content?.button_link) {
                      if (whoWeAreData.content.button_link.startsWith("#")) {
                        document
                          .querySelector(whoWeAreData.content.button_link)
                          ?.scrollIntoView({ behavior: "smooth" });
                      } else {
                        window.open(whoWeAreData.content.button_link, "_blank");
                      }
                    }
                  }}
                >
                  {whoWeAreData.content?.button_text || "READ MORE"}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="who-we-are-image"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="video-container">
              {!isVideoPlaying ? (
                <>
                  <div className="video-thumbnail">
                    <img
                      src={
                        whoWeAreData.content?.image_url
                          ? normalizeImageUrl(whoWeAreData.content.image_url)
                          : whoWeAreData.content?.video_url
                          ? `https://img.youtube.com/vi/${
                              whoWeAreData.content.video_url
                                .split("v=")[1]
                                ?.split("&")[0]
                            }/maxresdefault.jpg`
                          : "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
                      }
                      alt="About ARNA Energy"
                      className="thumbnail-image"
                    />
                    <div className="video-overlay"></div>
                    {whoWeAreData.content?.video_url && (
                      <button className="play-button" onClick={handlePlayVideo}>
                        <i className="fas fa-play"></i>
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <iframe
                  src={
                    whoWeAreData.content?.video_url
                      ? `${whoWeAreData.content.video_url.replace(
                          "watch?v=",
                          "embed/"
                        )}?autoplay=1&si=example`
                      : "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&si=example"
                  }
                  title="About ARNA Energy"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="about-video"
                ></iframe>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
