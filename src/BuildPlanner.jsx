import React, { useState, useEffect } from "react";
import { useBuild } from "./BuildContext";
import { items } from "./assets/items.js";
import IonianBootsImg from "../images/FoS Lucidity Boots.png";
import champData from "./assets/champs.json";

const boots = [
    { name: "Boots of Speed", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3009.png" },
    { name: "Mercury's Treads", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3111.png" },
    { name: "Plated Steelcaps", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3047.png" },
    { name: "Ionian Boots of Lucidity", img: IonianBootsImg },
];

const BLOODSONG_URL = "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3877.png";
const SOLSTICE_URL = "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3876.png";

function TeamBlock({ title, color, team, setTeam, otherTeam, forceLastBard = false }) {

    const [editingIndex, setEditingIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredChamps = champData.filter((c) =>
        c.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChampionClick = (index) => {
        setEditingIndex(index);
        setSearchQuery("");
    };

    const handleChampionSelect = (champ) => {
        const newTeam = [...team];
        newTeam[editingIndex] = champ;
        setTeam(newTeam);
        setEditingIndex(null);
        setSearchQuery("");
    };

// Searchbar schließen bei Klick außerhalb oder ESC
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".champ-search-popup")) {
                setEditingIndex(null);
            }
        };

        const handleEsc = (e) => {
            if (e.key === "Escape") setEditingIndex(null);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);



    const dragonExceptions = {
        "Nunu & Willump": "Nunu",
        "Wukong": "MonkeyKing",
        "Dr. Mundo": "DrMundo",
        "Jarvan IV": "JarvanIV",
        "K'Sante": "KSante",
        "Kog'Maw": "KogMaw",
        "Rek'Sai": "RekSai",
        "Renata Glasc": "Renata"
    };

    const champImg = (name) => {
        if (!name) return "https://via.placeholder.com/64";
        if (dragonExceptions[name]) {
            return `https://ddragon.leagueoflegends.com/cdn/15.20.1/img/champion/${dragonExceptions[name]}.png`;
        }
        let key = "";
        let capitalizeNext = true;
        for (let i = 0; i < name.length; i++) {
            const ch = name[i];
            if (ch === " ") capitalizeNext = true;
            else if (ch === "'") capitalizeNext = false;
            else {
                key += capitalizeNext ? ch.toUpperCase() : ch.toLowerCase();
                capitalizeNext = false;
            }
        }
        return `https://ddragon.leagueoflegends.com/cdn/15.20.1/img/champion/${key}.png`;
    };

    const { setTeam1, setTeam2 } = useBuild();

    const parsePickrate = (pickrateStr) => parseFloat((pickrateStr || "").replace("%", "")) || 0;

    const generateTeam = (roleOrder = ["Top", "Jungle", "Mid", "AD Carry", "Support"], usedSet = new Set(), forceBard = false) => {
        const pickChampion = (role) => {
            const pool = champData.filter(c => c.Role === role && !usedSet.has(c.Name));
            if (pool.length === 0) return { Name: "MissingNo", Role: role, Pickrate: "0%" };

            const total = pool.reduce((sum, c) => sum + parsePickrate(c.Pickrate), 0);
            let rand = Math.random() * total;

            for (const champ of pool) {
                rand -= parsePickrate(champ.Pickrate);
                if (rand <= 0) {
                    usedSet.add(champ.Name);
                    return champ;
                }
            }
            const fallback = pool[Math.floor(Math.random() * pool.length)];
            usedSet.add(fallback.Name);
            return fallback;
        };

        const team = roleOrder.map(role => pickChampion(role));

        if (forceBard) {
            const bard = champData.find(c => c.Name === "Bard");
            team[4] = bard ? bard : { Name: "Bard", Role: "Support", Pickrate: "0%" };
            usedSet.add("Bard");
        }

        return team;
    };

    const handleRandomize = () => {
        const used = new Set();

        // alle Champions des anderen Teams blockieren
        if (otherTeam) {
            otherTeam.forEach(ch => ch?.Name && used.add(ch.Name));
        }

        const newTeam = generateTeam(["Top", "Jungle", "Mid", "AD Carry", "Support"], used, forceLastBard);

        if (title.toLowerCase().includes("1")) setTeam1(newTeam);
        else setTeam2(newTeam);
    };

    const displayTeam = (team && team.length > 0) ? team : Array(5).fill({ Name: null });

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h3 style={{ color }}>{title}</h3>
            <button
                onClick={handleRandomize}
                style={{
                    background: color,
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    color: "#fff",
                    marginBottom: "8px",
                }}
            >
                🎲 Randomize
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {displayTeam.map((champ, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleChampionClick(idx)}
                        style={{position: "relative", cursor: "pointer"}}
                    >
                        <img
                            src={champImg(champ.Name)}
                            alt={champ.Name || "Unknown"}
                            title={`${champ.Name || "Unknown"} (${champ.Role || ""})`}
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "10px",
                                border: `3px solid ${color}`,
                                background: "#1a1a1a",
                            }}
                        />

                        {/* Suchfeld, wenn Champion bearbeitet wird */}
                        {editingIndex === idx && (
                            <div
                                className="champ-search-popup"
                                style={{
                                    position: "absolute",
                                    top: "90px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "200px", // breiter, damit Name + Icon reinpassen
                                    background: "#1e1e1e",
                                    border: "1px solid #444",
                                    borderRadius: "10px",
                                    padding: "8px",
                                    zIndex: 100,
                                    boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search champion..."
                                    autoFocus
                                    style={{
                                        width: "100%",
                                        padding: "6px 8px",
                                        borderRadius: "6px",
                                        border: "1px solid #555",
                                        background: "#111",
                                        color: "#fff",
                                        marginBottom: "6px",
                                        boxSizing: "border-box",
                                    }}
                                />
                                <div
                                    style={{
                                        maxHeight: "180px",
                                        overflowY: "auto",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "4px",
                                        scrollbarWidth: "thin",
                                    }}
                                >
                                    {filteredChamps.slice(0, 10).map((champOption) => (
                                        <div
                                            key={champOption.Name}
                                            onClick={() => handleChampionSelect(champOption)}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                padding: "6px",
                                                borderRadius: "6px",
                                                background: "#2a2a2a",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <img
                                                src={champImg(champOption.Name)}
                                                alt={champOption.Name}
                                                style={{width: "32px", height: "32px", borderRadius: "4px"}}
                                            />
                                            <span style={{color: "#fff", fontSize: "14px", whiteSpace: "nowrap"}}>
                            {champOption.Name}
                        </span>
                                        </div>
                                    ))}
                                    {filteredChamps.length === 0 && (
                                        <div style={{color: "#aaa", textAlign: "center", padding: "6px"}}>
                                            No results
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>


                ))}
            </div>
        </div>
    );
}


export default function BuildPlanner() {
    const [mode, setMode] = useState("add");
    const {
        viableItems, setViableItems,
        excludedItems, setExcludedItems,
        buildRoster, setBuildRoster,
        selectedBoot, setSelectedBoot,
        team1, setTeam1,
        team2, setTeam2,
    } = useBuild();

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "1") setMode("add");
            if (e.key === "2") setMode("exclude");
            if (e.key.toLowerCase() === "r") handleReset();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);


    const handleReset = () => {
        // Setze alles auf Anfang
        setViableItems([]);
        setExcludedItems([]);
        setSelectedBoot(null);

        // Setze Build Roster mit Default-Regeln
        const defaultRoster = [
            { name: "Bloodsong", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3877.png", fixed: true },
            { name: "Dead Man's Plate", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3742.png", fixed: true },
            null,
            null,
            null,
            null,
        ];
        setBuildRoster(defaultRoster);
    };


    useEffect(() => {
        if (team1.length === 0 && team2.length === 0) {
            const used = new Set();
            const parsePickrate = (str) => parseFloat(str.replace("%", "")) || 0;

            const pickChampion = (role) => {
                const pool = champData.filter(c => c.Role === role && !used.has(c.Name));
                if (pool.length === 0) return {Name: "MissingNo", Role: role, Pickrate: "0%"};
                const total = pool.reduce((s, c) => s + parsePickrate(c.Pickrate), 0);
                let rand = Math.random() * total;
                for (const champ of pool) {
                    rand -= parsePickrate(champ.Pickrate);
                    if (rand <= 0) {
                        used.add(champ.Name);
                        return champ;
                    }
                }
                const fallback = pool[Math.floor(Math.random() * pool.length)];
                used.add(fallback.Name);
                return fallback;
            };

            const roles = ["Top", "Jungle", "Mid", "AD Carry", "Support"];

            // Beide Teams mit gemeinsamem Pool generieren
            const t1 = roles.map(r => pickChampion(r));
            const t2 = roles.map(r => pickChampion(r));

            // Bard fix auf Support von Team 1 setzen (falls vorhanden)
            t1[4] = champData.find(c => c.Name === "Bard") || {Name: "Bard", Role: "Support", Pickrate: "0%"};
            used.add("Bard");

            setTeam1(t1);
            setTeam2(t2);
        }
    }, [team1, team2, setTeam1, setTeam2]);


    // Dein kompletter Item-, Boot- und Build-Roster-Teil bleibt unverändert ↓

    const handleItemClick = (item) => {
        if (mode === "add") {
            setViableItems((prev) =>
                prev.includes(item.name)
                    ? prev.filter((i) => i !== item.name)
                    : [...prev, item.name]
            );
        } else if (mode === "exclude") {
            setExcludedItems((prev) =>
                prev.includes(item.name)
                    ? prev.filter((i) => i !== item.name)
                    : [...prev, item.name]
            );
        }
    };

    const handleToggleBloodsong = () => {
        setBuildRoster(prev => {
            const newRoster = [...prev];
            if (newRoster[0].name === "Bloodsong") {
                newRoster[0] = {name: "Solstice Sleigh", img: SOLSTICE_URL, fixed: true};
            } else {
                newRoster[0] = {name: "Bloodsong", img: BLOODSONG_URL, fixed: true};
            }
            return newRoster;
        });
    };

    const handleAddToRoster = (item) => {
        if (item.name === "Bloodsong" || item.name === "Solstice Sleigh") {
            handleToggleBloodsong();
            return;
        }

        if (buildRoster.some(slot => slot?.name === item.name)) return;

        const newRoster = [...buildRoster];
        const slotIndex = newRoster.findIndex((slot, idx) => idx > 0 && !slot);
        if (slotIndex === -1) return;

        newRoster[slotIndex] = { name: item.name, img: item.img, fixed: false };
        setBuildRoster(newRoster);
    };

    // Entfernen aus Build Roster
    const handleRosterClick = (index) => {
        const slot = buildRoster[index];
        if (!slot) return;

        const newRoster = [...buildRoster];

        if (index === 0) {
            handleToggleBloodsong();
            return;
        }

        if (slot.name === "Dead Man's Plate" && !viableItems.includes("Dead Man's Plate")) {
            setViableItems(prev => [...prev, "Dead Man's Plate"]);
        }

        if (boots.some(b => b.name === slot.name)) {
            setSelectedBoot(null);
        }

        newRoster[index] = null;

        for (let i = 1; i < newRoster.length - 1; i++) {
            if (!newRoster[i] && newRoster[i + 1]) {
                newRoster[i] = newRoster[i + 1];
                newRoster[i + 1] = null;
            }
        }

        setBuildRoster(newRoster);
    };

    const handleBootClick = (boot) => {
        const newRoster = [...buildRoster];
        if (selectedBoot === boot.name) return;

        const oldBootIndex = newRoster.findIndex(slot => slot?.name === selectedBoot);
        if (oldBootIndex !== -1) {
            newRoster[oldBootIndex] = null;
        }

        const slotIndex = newRoster.findIndex((slot, idx) => idx > 0 && !slot);
        if (slotIndex === -1) return;

        newRoster[slotIndex] = { name: boot.name, img: boot.img, fixed: false };
        setBuildRoster(newRoster);
        setSelectedBoot(boot.name);
    };

    const filteredItems = items.filter(
        (item) => item.name !== "Dead Man's Plate" && item.name !== "Experimental Hexplate"
    );

    return (
        <div style={{display: "flex", flexDirection: "row", gap: "80px", margin: "20px"}}>

            {/* Linke Seite: kompletter Inhalt */}
            <div style={{margin: "0px auto 0 18px", width: "500px"}}>

                <div style={{marginBottom: "8px"}}>
                    <strong>Mode:</strong> {mode === "add" ? "Add" : "Exclude"} (Press 1/2)
                </div>

                <button
                    onClick={handleReset}
                    style={{
                        background: "linear-gradient(90deg, #444, #666)",
                        border: "none",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        color: "white",
                        cursor: "pointer",
                        marginBottom: "12px",
                    }}
                >
                    🔄 Reset (R)
                </button>


                {/* Item Grid */}
                <div style={{marginTop: "8px"}}>
                    {[
                        {label: "Self + Def", color1: "#b06cff", color2: "#5bff8a", filter: i => i.x < 0 && i.y < 0},
                        {label: "Team + Def", color1: "#6fc7ff", color2: "#5bff8a", filter: i => i.x < 0 && i.y >= 0},
                        {label: "Self + Dmg", color1: "#b06cff", color2: "#ff6666", filter: i => i.x >= 0 && i.y < 0},
                        {label: "Team + Dmg", color1: "#6fc7ff", color2: "#ff6666", filter: i => i.x >= 0 && i.y >= 0},
                    ].map((quad) => {
                        const itemsToShow = filteredItems.filter(quad.filter);
                        if (itemsToShow.length === 0) return null;

                        return (
                            <div key={quad.label} style={{marginBottom: "10px"}}>
                                <h3
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        marginBottom: "8px",
                                        background: `linear-gradient(90deg, ${quad.color1}, ${quad.color2})`,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    {quad.label}
                                </h3>

                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "8px",
                                        position: "relative",
                                    }}
                                >
                                    {itemsToShow.map((item) => {
                                        const isExcluded = excludedItems.includes(item.name);
                                        return (
                                            <div
                                                key={item.name}
                                                style={{
                                                    position: "relative",
                                                    width: "48px",
                                                    height: "48px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => handleItemClick(item)}
                                            >
                                                <img
                                                    src={item.img}
                                                    alt={item.name}
                                                    style={{
                                                        width: "48px",
                                                        height: "48px",
                                                        borderRadius: "10px",
                                                        display: "block",
                                                        filter: isExcluded ? "brightness(60%)" : "none",
                                                        transition: "all 0.2s",
                                                    }}
                                                />

                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                        width: "100%",
                                                        height: "100%",
                                                        borderRadius: "10px",
                                                        pointerEvents: "none",
                                                        zIndex: 2,
                                                        opacity: 0,
                                                        background: "rgba(255,0,0,0.3)",
                                                        transition: "opacity 0.2s",
                                                    }}
                                                    className="hover-overlay"
                                                />

                                                {isExcluded && (
                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            top: 0,
                                                            left: 0,
                                                            width: "100%",
                                                            height: "100%",
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            zIndex: 3,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: "100%",
                                                                height: "5px",
                                                                background: "red",
                                                                transform: "rotate(45deg)",
                                                                position: "absolute",
                                                            }}
                                                        />
                                                        <div
                                                            style={{
                                                                width: "100%",
                                                                height: "5px",
                                                                background: "red",
                                                                transform: "rotate(-45deg)",
                                                                position: "absolute",
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Boots */}
                <div style={{marginTop: "1px"}}>
                    <h3>Boots:</h3>
                    <div style={{display: "flex", gap: "10px"}}>
                        {boots.map((boot) => (
                            <img
                                key={boot.name}
                                src={boot.img}
                                alt={boot.name}
                                style={{
                                    width: "42px",
                                    height: "42px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    filter: selectedBoot === boot.name ? "brightness(60%)" : "none",
                                }}
                                onClick={() => handleBootClick(boot)}
                            />
                        ))}
                    </div>
                </div>

                {/* Viable Items */}
                <div style={{marginTop: "0px"}}>
                    <h3>Viable Items:</h3>
                    <div style={{display: "flex", flexWrap: "wrap", gap: "10px"}}>
                        {viableItems.map((name) => {
                            const item = items.find((i) => i.name === name);
                            return (
                                <img
                                    key={name}
                                    src={item.img}
                                    alt={name}
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "8px",
                                        filter: buildRoster.some(slot => slot?.name === item.name)
                                            ? "brightness(60%)"
                                            : "none",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleAddToRoster(item)}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Build Roster */}
                <div style={{marginTop: "0px", marginBottom: "300px"}}>
                    <h3>Build Roster:</h3>
                    <div style={{display: "flex", gap: "10px"}}>
                        {buildRoster.map((slot, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    border: "2px solid #333",
                                    borderRadius: "8px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    background: "#1a1a1a",
                                    cursor: slot ? "pointer" : "default",
                                }}
                                onClick={() => handleRosterClick(idx)}
                            >
                                {slot && (
                                    <img
                                        src={slot.img}
                                        alt={slot.name}
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "8px",
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <style>
                    {`
                    div:hover > .hover-overlay {
                        opacity: 1;
                    }
                `}
                </style>
            </div>

            {/* Rechte Seite – Teams nebeneinander */}
            <div style={{display: "flex", flexDirection: "row", gap: "40px", alignItems: "flex-start"}}>
                <TeamBlock title="Team 1" color="limegreen" team={team1} setTeam={setTeam1} otherTeam={team2}
                           forceLastBard={true}/>
                <TeamBlock title="Team 2" color="crimson" team={team2} setTeam={setTeam2} otherTeam={team1} />
            </div>


        </div>
    );


}