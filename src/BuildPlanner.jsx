import React, { useState, useEffect } from "react";
import { items } from "./items";
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

const usedChamps = new Set();
function TeamBlock({ title, color, roleOrder = ["Top","Jungle","Mid","AD Carry","Support"], forceLastBard = false }) {

    //List of exceptions that dont follow rules
    const dragonExceptions = {
        "Nunu & Willump": "Nunu",
        "Wukong" : "MonkeyKing",
        "Dr. Mundo" : "DrMundo",
        "Jarvan IV" : "JarvanIV",
        "K'Sante" : "KSante",
        "Kog'Maw" : "KogMaw",
        "Rek'Sai" : "RekSai",

    };

    const champImg = (name) => {
        if (!name) return "https://via.placeholder.com/64";

        if (dragonExceptions[name]) {
            return `https://ddragon.leagueoflegends.com/cdn/15.20.1/img/champion/${dragonExceptions[name]}.png`;
        }

        // to differentiate between " " and '
        let key = "";
        let capitalizeNext = true;

        for (let i = 0; i < name.length; i++) {
            const ch = name[i];

            if (ch === " ") {
                // If whitespace → next letter big
                capitalizeNext = true;
            } else if (ch === "'") {
                // If ' → next letter isnt capitalized
                capitalizeNext = false;
            } else {
                if (capitalizeNext) {
                    key += ch.toUpperCase();
                    capitalizeNext = false;
                } else {
                    key += ch.toLowerCase();
                }
            }
        }

        return `https://ddragon.leagueoflegends.com/cdn/15.20.1/img/champion/${key}.png`;
    };





    // Pickrate Randomizer
    const parsePickrate = (pickrateStr) => parseFloat(pickrateStr.replace("%", "")) || 0;

    const pickChampionByRole = (role) => {
        // Filter: right role and not used yet
        const pool = champData.filter(c => c.Role === role && !usedChamps.has(c.Name));
        if (pool.length === 0) return { Name: "MissingNo", Role: role, Pickrate: "0%" };

        const total = pool.reduce((sum, c) => sum + parsePickrate(c.Pickrate), 0);
        let rand = Math.random() * total;

        for (const champ of pool) {
            rand -= parsePickrate(champ.Pickrate);
            if (rand <= 0) {
                usedChamps.add(champ.Name);
                return champ;
            }
        }

        // Fallback
        const randomChamp = pool[Math.floor(Math.random() * pool.length)];
        usedChamps.add(randomChamp.Name);
        return randomChamp;
    };

    const [team, setTeam] = React.useState(() => {
        const t = roleOrder.map(role => pickChampionByRole(role));
        if (forceLastBard) {
            const bard = champData.find(c => c.Name === "Bard");
            t[4] = bard ? bard : { Name: "Bard", Role: "Support", Pickrate: "0%" };
            usedChamps.add("Bard");
        }
        return t;
    });

    const randomizeTeam = () => {
        team.forEach(champ => usedChamps.delete(champ.Name));

        const newTeam = roleOrder.map(role => pickChampionByRole(role));
        if (forceLastBard) {
            const bard = champData.find(c => c.Name === "Bard");
            newTeam[4] = bard ? bard : { Name: "Bard", Role: "Support", Pickrate: "0%" };
            usedChamps.add("Bard");
        }
        setTeam(newTeam);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h3 style={{ color }}>{title}</h3>
            <button
                onClick={randomizeTeam}
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
                {team.map((champ, idx) => (
                    <img
                        key={idx}
                        src={champImg(champ.Name)}
                        alt={champ.Name || "Unknown"}
                        title={`${champ.Name} (${champ.Role})`}
                        style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "10px",
                            border: `3px solid ${color}`,
                            background: "#1a1a1a",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}


export default function BuildPlanner() {
    const [mode, setMode] = useState("add"); // 'add' oder 'exclude'
    const [viableItems, setViableItems] = useState([]);
    const [excludedItems, setExcludedItems] = useState([]);
    const [buildRoster, setBuildRoster] = useState([
        { name: "Bloodsong", img: BLOODSONG_URL, fixed: true },
        { name: "Dead Man's Plate", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3742.png", fixed: true },
        null,
        null, //
        null,
        null,
    ]);
    const [selectedBoot, setSelectedBoot] = useState(null);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "1") setMode("add");
            if (e.key === "2") setMode("exclude");
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

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
                newRoster[0] = { name: "Solstice Sleigh", img: SOLSTICE_URL, fixed: true };
            } else {
                newRoster[0] = { name: "Bloodsong", img: BLOODSONG_URL, fixed: true };
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
        <div style={{ display: "flex", flexDirection: "row", gap: "80px", margin: "20px" }}>

            {/* Linke Seite: kompletter Inhalt */}
            <div style={{ margin: "0px auto 0 18px", width: "500px" }}>

                <div style={{ marginBottom: "8px" }}>
                    <strong>Mode:</strong> {mode === "add" ? "Add" : "Exclude"} (Press 1/2)
                </div>

                {/* Item Grid */}
                <div style={{ marginTop: "8px" }}>
                    {[
                        { label: "Self + Def", color1: "#b06cff", color2: "#5bff8a", filter: i => i.x < 0 && i.y < 0 },
                        { label: "Team + Def", color1: "#6fc7ff", color2: "#5bff8a", filter: i => i.x < 0 && i.y >= 0 },
                        { label: "Self + Dmg", color1: "#b06cff", color2: "#ff6666", filter: i => i.x >= 0 && i.y < 0 },
                        { label: "Team + Dmg", color1: "#6fc7ff", color2: "#ff6666", filter: i => i.x >= 0 && i.y >= 0 },
                    ].map((quad) => {
                        const itemsToShow = filteredItems.filter(quad.filter);
                        if (itemsToShow.length === 0) return null;

                        return (
                            <div key={quad.label} style={{ marginBottom: "10px" }}>
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
                <div style={{ marginTop: "1px" }}>
                    <h3>Boots:</h3>
                    <div style={{ display: "flex", gap: "10px" }}>
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
                <div style={{ marginTop: "0px" }}>
                    <h3>Viable Items:</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
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
                <div style={{ marginTop: "0px", marginBottom: "300px" }}>
                    <h3>Build Roster:</h3>
                    <div style={{ display: "flex", gap: "10px" }}>
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
                <TeamBlock title="Team 1" color="limegreen" forceLastBard={true}/>
                <TeamBlock title="Team 2" color="crimson" forceLastBard={false}/>
            </div>


        </div>
    );


}
