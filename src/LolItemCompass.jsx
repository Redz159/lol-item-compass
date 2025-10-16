import React, { useState, useEffect } from "react";

export default function LoLItemCompass() {
  const [activeItem, setActiveItem] = useState(null);
  const [filtersEnabled, setFiltersEnabled] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Klick außerhalb schließt Tooltip
  useEffect(() => {
    const handleClickOutside = () => setActiveItem(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Itemdaten (Positionen bleiben gleich)
  const items = [
    {
      name: "Wits End",
      img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3091.png",
      x: 60,
      y: -200,
      desc: "Against high AP and CC",
      categories: ["Heavy AP", "Much CC"]
    },
      {
          name: "Terminus",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/223302.png",
          x: 170,
          y: -230,
          desc: "Late game - Long Fights",
          categories: ["Long Fights", "Mixed Dmg"],
      },
      {
          name: "Riftmaker",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/4633.png",
          x: 240,
          y: -220,
          desc: "More damage - Long Fights",
          categories: ["Long Fights"],
      },
      {
          name: "Liandry's Torment",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/7012.png",
          x: 290,
          y: -160,
          desc: "HP Stacking - Meele Frontline",
          categories: ["Heavy Front line", "Enemy team tanky"],
      },
      {
          name: "Experimental Hexplate",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/7036.png",
          x: 360,
          y: -190,
          desc: "Really big lead - Reposition for Q",
          categories: ["Ahead"],
      },
      {
          name: "Statikk Shiv",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3087.png",
          x: 410,
          y: -240,
          desc: "Lack Waveclear - Teamfights",
          categories: ["Lack Waveclear"],
      },
      {
          name: "Zhonya's Hourglass",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/223157.png",
          x: 120,
          y: -170,
          desc: "Enemy Dive - Resets",
          categories: ["Much Single target CC", "Resets (Jinx, Viego)"],
      },
      {
          name: "Cosmic Drive",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/4629.png",
          x: 380,
          y: -120,
          desc: "Need AH (more Ults) - Fast enemies, eg. Sivir, Vayne",
          categories: ["Long Fights", "Fast enemies"],
      },
      {
          name: "Dead Man's plate",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3742.png",
          x: -80,
          y: -120,
          desc: "Always",
          categories: ["Enemy team tanky", "Heavy AD", "Heavy AP", "Own team 2+ AP Carries", "Heavy Front line", "Long Fights", "Ahead", "Behind", "Much CC", "Much Single target CC", "Many shields", "Much AOE", "2+ Autoattackers", "2+ Crits", "Lack Waveclear"]
      },
      {
          name: "Force of Nature",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/4401.png",
          x: -320,
          y: -210,
          desc: "Need MR - Long Fights",
          categories: ["Heavy AP", "Long Fights"],
      },
      {
          name: "Randuin's Omen",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3143.png",
          x: -380,
          y: -150,
          desc: "2+ Critters - Need Armor",
          categories: ["2+ Crits", "Heavy AD"],
      },
      {
          name: "Kaenic Rookern",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/2504.png",
          x: -390,
          y: -220,
          desc: "Need MR - Enemy Poke",
          categories: ["Heavy AP", "Enemy Poke"],
      },
      {
          name: "Jak'Sho, The Protean",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6665.png",
          x: -450,
          y: -240,
          desc: "Mixed Dmg",
          categories: ["Mixed Dmg", "Long Fights"],
      },
      {
          name: "Redemption",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3107.png",
          x: -240,
          y: 245,
          desc: "In place Fight",
          categories: ["Much AOE", "Heavy Front line"],
      },
      {
          name: "Mikael's Blessing",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3222.png",
          x: -170,
          y: 250,
          desc: "Single Target CC",
          categories: ["Much Single target CC"],
      },
      {
          name: "Knight's Vow",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3109.png",
          x: -310,
          y: 230,
          desc: "Single Carry in Team",
          categories: ["1 Carry in Team"],
      },
      {
          name: "Locket of the Iron Solari",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3190.png",
          x: -380,
          y: 250,
          desc: "Instant AOE Dmg",
          categories: ["Much AOE"],
      },
      {
          name: "Frozen Heart",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3110.png",
          x: -450,
          y: 180,
          desc: "2+ Autoattacker's - Need Armor",
          categories: ["2+ Autoattackers", "Heavy AD"],
      },
      {
          name: "Abyssal Mask",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/8020.png",
          x: 50,
          y: 80,
          desc: "Team 2+ AP - Need MR",
          categories: ["Own team 2+ AP Carries", "Heavy AP"],
      },
      {
          name: "Imperial Mandate",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/4005.png",
          x: 380,
          y: 150,
          desc: "Behind - Need Dmg Amp",
          categories: ["Behind"],
      },
      {
          name: "Bloodletter's Curse",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/4010.png",
          x: 300,
          y: 150,
          desc: "Team 2+ AP Carries",
          categories: ["Own team 2+ AP Carries"],
      },
      {
          name: "Serpent's Fang",
          img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6695.png",
          x: 400,
          y: 210,
          desc: "Against heavy Shield",
          categories: ["Many shields"],
      },
  ];

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
            "Resets (Jinx, Viego)",
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
                margin: "60px auto",
                gap: "20px",
            }}
        >
            {/* ==================== */}
            {/* 🧭 KOMPASS */}
            {/* ==================== */}
            <div
                style={{
                    position: "relative",
                    left: "1%",
                    width: "1564px",
                    height: "880px",
                    background: "#0d0d0d",
                    border: "2px solid #333",
                    borderRadius: "16px",
                    overflow: "visible",
                }}
            >
                {/* Achsen */}
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

                {/* Achsenbeschriftung */}
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
                {filteredItems.map((item) => {
                    // 🔥 Anzahl der übereinstimmenden Kategorien
                    // ⚙️ Punktzahl basierend auf Filtergruppen
                    let matchScore = 0;
                    if (filtersEnabled) {
                        item.categories.forEach((cat) => {
                            if (selectedFilters.includes(cat)) {
                                if (filterGroups.Specific.includes(cat)) matchScore += 2;
                                else if (filterGroups.General.includes(cat)) matchScore += 1;
                            }
                        });
                    }


// 🔥 Glow & Skalierung abhängig von matchScore
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