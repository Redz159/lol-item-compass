import React, { useState, useEffect } from "react";
import { useBuild } from "./BuildContext";
import{items} from "./items";

export default function LoLItemCompass() {

  const [activeItem, setActiveItem] = useState(null);

  const { filtersEnabled, setFiltersEnabled, selectedFilters, setSelectedFilters, items } = useBuild();


  //Click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = () => setActiveItem(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Different Items


    //Different Categories "General" for shared categories, "Specific" for more niche ones
    const filterGroups = {
        General: [
            "Enemy team tanky",
            "Heavy AD",
            "Heavy AP",
            "Mixed Dmg",
            "Own team 2+ AP Carries",
            "Heavy Front line",
            "Long Fights",
        ],
        Specific: [
            "Ahead",
            "Behind",
            "Enemy Poke",
            "Much CC",
            "Much Single target CC",
            "Many shields",
            "Much AOE",
            "2+ Autoattackers",
            "2+ Crits",
            "Lack Waveclear",
            "Resets (Jinx, Viego...)",
            "1 Carry in Team",
        ],
    };

    // -----------------------------
    // 🔧 Filter-Handler
    // -----------------------------
    const handleFilterChange = (filter) => {
        setSelectedFilters((prev) =>
            prev.includes(filter)
                ? prev.filter((f) => f !== filter)
                : [...prev, filter]
        );
    };

    const resetFilters = () => {
        setSelectedFilters([]);
    };

    const filteredItems =
        !filtersEnabled || selectedFilters.length === 0
            ? items
            : items.filter((item) =>
                item.categories.some((c) => selectedFilters.includes(c))
            );


    // -----------------------------
    // 🔲 Rendering
    // -----------------------------
    const handleItemClick = (e, item) => {
        e.stopPropagation();
        setActiveItem(activeItem === item.name ? null : item.name);
    };

    return (
        <div
            style={{
                position: "relative",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                width: "1800px",
                margin: "2px auto",
                gap: "20px",
            }}
        >
            {/* ==================== */}
            {/* 🧭 KOMPASS */}
            {/* ==================== */}
            <div
                style={{
                    position: "relative",
                    left: "18px",
                    width: "1564px",
                    height: "880px",
                    background: "#0d0d0d",
                    border: "2px solid #333",
                    borderRadius: "16px",
                    overflow: "visible",
                    marginBottom:"100px"
                }}
            >
                {/* Axis */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "0",
                        width: "3px",
                        height: "100%",
                        background: "#555",
                        transform: "translateX(-50%)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "0",
                        width: "100%",
                        height: "3px",
                        background: "#555",
                        transform: "translateY(-50%)",
                    }}
                />

                {/* Axis Label */}
                <div
                    style={{
                        position: "absolute",
                        top: "5px",
                        left: "54%",
                        transform: "translateX(-50%)",
                        color: "#b06cff",
                        fontWeight: "bold",
                        fontSize: "25px",
                    }}
                >
                    SELF ↑
                </div>
                <div
                    style={{
                        position: "absolute",
                        bottom: "5px",
                        left: "54%",
                        transform: "translateX(-50%)",
                        color: "#6fc7ff",
                        fontWeight: "bold",
                        fontSize: "25px",
                    }}
                >
                    TEAM ↓
                </div>
                <div
                    style={{
                        position: "absolute",
                        top: "48%",
                        left: "10px",
                        transform: "translateY(-50%)",
                        color: "#5bff8a",
                        fontWeight: "bold",
                        fontSize: "25px",
                    }}
                >
                    DEF ←
                </div>
                <div
                    style={{
                        position: "absolute",
                        top: "48%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        color: "#ff6666",
                        fontWeight: "bold",
                        fontSize: "25px",
                    }}
                >
                    → DMG
                </div>


                {/* Items */}
                {/* Weighs niche situations more than general ones*/}
                {filteredItems.map((item) => {

                    let matchScore = 0;
                    if (filtersEnabled) {
                        item.categories.forEach((cat) => {
                            if (selectedFilters.includes(cat)) {
                                if (filterGroups.Specific.includes(cat)) matchScore += 2;
                                else if (filterGroups.General.includes(cat)) matchScore += 1;
                            }
                        });
                    }


                    // increases glow based on matching categories
                    const scaleValue =
                        matchScore >= 3 ? 1.25 : matchScore >= 2 ? 1.15 : 1.0;


                    return (
                        <div
                            key={item.name}
                            onClick={(e) => handleItemClick(e, item)}
                            style={{
                                position: "absolute",
                                left: `calc(50% + ${item.x * 1.5}px)`,
                                top: `calc(50% + ${item.y * 1.5}px)`,
                                transform: `translate(-50%, -50%) scale(${scaleValue})`,
                                cursor: "pointer",
                                zIndex: activeItem === item.name ? 20 : 5,
                                transition: "all 0.3s ease",
                            }}
                        >
                            <img
                                src={item.img}
                                alt={item.name}
                                style={{
                                    width: "70px",
                                    height: "70px",
                                    borderRadius: "12px",
                                    border: activeItem === item.name ? "3px solid gold" : "3px solid transparent",
                                    boxShadow: filtersEnabled && matchScore > 1
                                        ? `0 0 ${matchScore * 8}px rgba(255,255,150,0.6)`
                                        : "0 0 10px rgba(255,255,255,0.15)",
                                    background: "#1a1a1a",
                                    transition: "all 0.3s ease",
                                }}
                            />

                            {/* Tooltip */}
                            {activeItem === item.name && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "0px",
                                        left: "82px",
                                        background: "rgba(40, 40, 80, 0.9)",
                                        border: "1px solid rgba(120, 120, 255, 0.3)",
                                        boxShadow: "0 0 12px rgba(100, 100, 255, 0.4)",
                                        backdropFilter: "blur(6px)",
                                        color: "#fff",
                                        padding: "10px 12px",
                                        borderRadius: "8px",
                                        width: "220px",
                                        fontSize: "16px",
                                        lineHeight: "1.4",
                                        zIndex: 9999,
                                        textAlign: "left",
                                    }}
                                >
                                    <div style={{ fontWeight: "bold", marginBottom: "6px", color: "#ffd700" }}>
                                        {item.name}
                                    </div>
                                    <div style={{ color: "#ccc" }}>{item.desc}</div>
                                </div>
                            )}
                        </div>
                    );
                })}

            </div>

            {/* ==================== */}
            {/* 🧩 FILTER PANEL */}
            {/* ==================== */}
            <div
                style={{
                    width: "320px",
                    background: "#141414",
                    border: "2px solid #333",
                    borderRadius: "16px",
                    padding: "16px",
                    color: "#eee",
                    fontFamily: "sans-serif",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ fontSize: "20px", margin: 0 }}>Filter:</h2>
                    <button
                        onClick={resetFilters}
                        style={{
                            background: "#333",
                            color: "#fff",
                            border: "1px solid #555",
                            borderRadius: "6px",
                            padding: "4px 10px",
                            cursor: "pointer",
                        }}
                    >
                        Reset
                    </button>
                </div>

                {/* Toggle */}
                <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span>An/Aus</span>
                        <input
                            type="checkbox"
                            checked={filtersEnabled}
                            onChange={() => setFiltersEnabled(!filtersEnabled)}
                            style={{ width: "40px", height: "20px" }}
                        />
                    </label>
                </div>

                {/* General */}
                <h3 style={{ borderBottom: "1px solid #333", paddingBottom: "4px", marginTop: "20px" }}>General</h3>
                {filterGroups.General.map((filter) => (
                    <label key={filter} style={{ display: "block", marginTop: "6px" }}>
                        <input
                            type="checkbox"
                            checked={selectedFilters.includes(filter)}
                            onChange={() => handleFilterChange(filter)}
                            style={{ marginRight: "8px" }}
                        />
                        {filter}
                    </label>
                ))}

                {/* Specific */}
                <h3 style={{ borderBottom: "1px solid #333", paddingBottom: "4px", marginTop: "20px" }}>Specific</h3>
                {filterGroups.Specific.map((filter) => (
                    <label key={filter} style={{ display: "block", marginTop: "6px" }}>
                        <input
                            type="checkbox"
                            checked={selectedFilters.includes(filter)}
                            onChange={() => handleFilterChange(filter)}
                            style={{ marginRight: "8px" }}
                        />
                        {filter}
                    </label>
                ))}
            </div>
        </div>
    );
}