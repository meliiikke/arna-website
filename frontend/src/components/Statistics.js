import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
// Removed framer-motion for instant render
import CountUp from "react-countup";
import { apiGet } from "../utils/api";
import "./Statistics.css";

const Statistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [mapPoints, setMapPoints] = useState([]);
  const [headerData, setHeaderData] = useState({
    title: "We Spread Around The World",
    subtitle: "Global Presence",
    content:
      "Laoreet lorem consectetuer hendrerit dictumst curae volutpat cubilia elit velit natoque. Eleifend diam volutpat lectus aliquam aenean. Dolor sed orci scelerisque taciti sodales tortor.",
  });
  const [globalPresenceContent, setGlobalPresenceContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const statisticsRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      console.log("🚀 Starting Statistics data fetch...");
      console.log(
        "🌐 API Base URL:",
        process.env.REACT_APP_API_BASE_URL || "https://api.arna.one/api"
      );

      // Use Promise.all to fetch all APIs simultaneously for better performance
      const [contentResponse, statisticsResponse, mapPointsResponse] =
        await Promise.all([
          apiGet("/api/global-presence/content"),
          apiGet("/api/statistics"),
          apiGet("/api/map-points"),
        ]);

      console.log("🔍 Global Presence content API response:", contentResponse);
      console.log("🔍 Statistics API response:", statisticsResponse);
      console.log("🔍 Map Points API response:", mapPointsResponse);

      // Process global presence content
      let content = null;
      if (contentResponse && !contentResponse.error && contentResponse.title) {
        console.log(
          "✅ Global Presence content loaded from backend:",
          contentResponse
        );
        content = contentResponse;
        setGlobalPresenceContent(content);

        // Update header data with backend content
        setHeaderData({
          title: content.title || "We Spread Around The World",
          subtitle: content.subtitle || "Global Presence",
          content:
            content.description ||
            "Laoreet lorem consectetuer hendrerit dictumst curae volutpat cubilia elit velit natoque. Eleifend diam volutpat lectus aliquam aenean. Dolor sed orci scelerisque taciti sodales tortor.",
        });
      } else {
        console.log("⚠️ No content from backend, using fallback data");
        setGlobalPresenceContent(null);
      }

      // Process statistics data
      let statisticsData = [];
      if (
        statisticsResponse &&
        !statisticsResponse.error &&
        Array.isArray(statisticsResponse) &&
        statisticsResponse.length > 0
      ) {
        console.log("✅ Statistics loaded from backend:", statisticsResponse);
        statisticsData = statisticsResponse;
      } else {
        console.log("⚠️ No statistics from backend, using fallback data");
        statisticsData = [
          { id: 1, title: "Years of Experience", value: "25+" },
          { id: 2, title: "Office Worldwide", value: "77" },
          { id: 3, title: "Workers Employed", value: "38K" },
        ];
      }

      setStatistics(statisticsData);

      // Process map points data
      let mapPointsData = [];
      if (
        mapPointsResponse &&
        !mapPointsResponse.error &&
        Array.isArray(mapPointsResponse) &&
        mapPointsResponse.length > 0
      ) {
        console.log("✅ Map points loaded from backend:", mapPointsResponse);
        mapPointsData = mapPointsResponse;
      } else {
        console.log("⚠️ No map points from backend, using fallback data");
        mapPointsData = [
          {
            id: 1,
            title: "New York Office",
            description: "North America Headquarters",
            latitude: 40.7128,
            longitude: -74.006,
          },
          {
            id: 2,
            title: "London Office",
            description: "European Operations Center",
            latitude: 51.5074,
            longitude: -0.1278,
          },
          {
            id: 3,
            title: "Tokyo Office",
            description: "Asia Pacific Regional Hub",
            latitude: 35.6762,
            longitude: 139.6503,
          },
          {
            id: 4,
            title: "Dubai Office",
            description: "Middle East Operations",
            latitude: 25.2048,
            longitude: 55.2708,
          },
          {
            id: 5,
            title: "Sydney Office",
            description: "Australia & Oceania",
            latitude: -33.8688,
            longitude: 151.2093,
          },
        ];
      }

      setMapPoints(mapPointsData);

      setError(null);
    } catch (error) {
      console.error("❌ Error fetching statistics data:", error);
      setError(error.message);
      setStatistics([]);
      setMapPoints([]);
      setGlobalPresenceContent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: "0px 0px -100px 0px", // Start animation slightly before element is fully visible
      }
    );

    if (statisticsRef.current) {
      observer.observe(statisticsRef.current);
    }

    return () => {
      if (statisticsRef.current) {
        observer.unobserve(statisticsRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <section className="statistics section bg-dark" ref={statisticsRef}>
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading statistics...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="statistics section bg-dark" ref={statisticsRef}>
      {error && (
        <div
          style={{ color: "red", textAlign: "center", marginBottom: "20px" }}
        >
          Error: {error}
        </div>
      )}

      <div className="statistics-layout">
        {/* Top Section - Title and Description (Left Aligned) */}
        <div className="statistics-header">
          <div className="section-header">
            <h2 className="section-title">{headerData.title}</h2>
          </div>

          <div className="section-description-container">
            <p className="section-description">{headerData.content}</p>
          </div>
        </div>

        {/* Middle Section - Statistics Content */}
        <div className="statistics-content">
          <div className="stats-grid">
            {statistics && statistics.length > 0 ? (
              statistics.map((stat, index) => (
                <div key={stat.id} className="stat-card">
                  <div className="stat-content">
                    <div className="stat-value">
                      {stat.value && stat.value.includes("+") ? (
                        <CountUp
                          end={
                            isInView
                              ? parseInt(stat.value.replace(/[^0-9]/g, "")) || 0
                              : 0
                          }
                          duration={2.5}
                          delay={isInView ? 0.5 + index * 0.2 : 0}
                          suffix="+"
                          useEasing={true}
                          useGrouping={false}
                          start={0}
                        />
                      ) : stat.value && stat.value.includes("K") ? (
                        <CountUp
                          end={
                            isInView
                              ? parseInt(stat.value.replace(/[^0-9]/g, "")) || 0
                              : 0
                          }
                          duration={2.5}
                          delay={isInView ? 0.5 + index * 0.2 : 0}
                          suffix="K"
                          useEasing={true}
                          useGrouping={false}
                          start={0}
                        />
                      ) : (
                        <CountUp
                          end={
                            isInView
                              ? parseInt(stat.value.replace(/[^0-9]/g, "")) || 0
                              : 0
                          }
                          duration={2.5}
                          delay={isInView ? 0.5 + index * 0.2 : 0}
                          useEasing={true}
                          useGrouping={false}
                          start={0}
                        />
                      )}
                    </div>
                    <div className="stat-title">{stat.title}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">No statistics available</div>
            )}
          </div>
        </div>

        {/* Bottom Section - Map Image with Points */}
        <div className="statistics-map">
          <div className="map-container1">
            <img
              src={require("../images/harita.png")}
              alt="World Map"
              className="map-image"
              loading="lazy"
              decoding="async"
            />

            {/* Map Points Overlay */}
            <div className="map-points-overlay">
              {mapPoints && mapPoints.length > 0 ? (
                mapPoints.map((point, index) => {
                  let x, y;

                  if (point.x && point.y) {
                    x = point.x;
                    y = point.y;
                  } else if (point.latitude && point.longitude) {
                    // Convert lat/lng to percentage coordinates
                    x = ((point.longitude + 180) / 360) * 100;
                    y = ((90 - point.latitude) / 180) * 100;
                  } else {
                    // Default locations for demo
                    const locations = [
                      { x: 35, y: 45 }, // North America
                      { x: 50, y: 40 }, // Europe
                      { x: 65, y: 35 }, // Asia
                      { x: 70, y: 60 }, // Australia
                      { x: 55, y: 65 }, // Africa
                    ];
                    const location = locations[index % locations.length];
                    x = location.x;
                    y = location.y;
                  }

                  return (
                    <div
                      key={point.id}
                      className="map-point"
                      style={{
                        position: "absolute",
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      title={`${point.title}: ${point.description}`}
                    >
                      <div className="marker-pin"></div>
                      <div className="marker-tooltip">
                        <div className="tooltip-title">{point.title}</div>
                        <div className="tooltip-description">
                          {point.description}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Default demo points
                <>
                  <div
                    className="map-point"
                    style={{
                      position: "absolute",
                      left: "35%",
                      top: "45%",
                      transform: "translate(-50%, -50%)",
                    }}
                    title="New York Office"
                  >
                    <div className="marker-pin"></div>
                    <div className="marker-tooltip">
                      <div className="tooltip-title">New York</div>
                      <div className="tooltip-description">
                        North America Office
                      </div>
                    </div>
                  </div>

                  <div
                    className="map-point"
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "40%",
                      transform: "translate(-50%, -50%)",
                    }}
                    title="London Office"
                  >
                    <div className="marker-pin"></div>
                    <div className="marker-tooltip">
                      <div className="tooltip-title">London</div>
                      <div className="tooltip-description">European Office</div>
                    </div>
                  </div>

                  <div
                    className="map-point"
                    style={{
                      position: "absolute",
                      left: "65%",
                      top: "35%",
                      transform: "translate(-50%, -50%)",
                    }}
                    title="Tokyo Office"
                  >
                    <div className="marker-pin"></div>
                    <div className="marker-tooltip">
                      <div className="tooltip-title">Tokyo</div>
                      <div className="tooltip-description">
                        Asia Pacific Office
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
