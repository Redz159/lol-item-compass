import React, { useState, useEffect } from "react";
import { items } from "./items";
import IonianBootsImg from "../images/FoS Lucidity Boots.png";


const boots = [
    { name: "Boots of Speed", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3009.png" },
    { name: "Mercury's Treads", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3111.png" },
    { name: "Plated Steelcaps", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3047.png" },
    { name: "Ionian Boots of Lucidity", img: IonianBootsImg },
];

const BLOODSONG_URL = "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3877.png";
const SOLSTICE_URL = "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3876.png";

export default function BuildPlanner() {
    const [mode, setMode] = useState("add"); // 'add' oder 'exclude'
    const [viableItems, setViableItems] = useState([]);
    const [excludedItems, setExcludedItems] = useState([]);
    const [buildRoster, setBuildRoster] = useState([
        { name: "Bloodsong", img: BLOODSONG_URL, fixed: true },
        { name: "Dead Man's Plate", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3742.png", fixed: true },
        null,
        null,
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

    // Hinzufügen ins Build Roster
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
        <div style={{margin: "20px auto 0 18px", width: "500px"}}>

            <div style={{marginBottom: "10px"}}>
                <strong>Modus:</strong> {mode === "add" ? "Add" : "Exclude"} (Press 1/2)
            </div>

            {/* Item Grid */}
            <div style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px 8px", position: "relative"}}>
                {filteredItems.map((item) => {
                    const isExcluded = excludedItems.includes(item.name);

                    return (
                        <div
                            key={item.name}
                            style={{position: "relative", width: "60px", height: "60px", cursor: "pointer"}}
                            onClick={() => handleItemClick(item)}
                        >
                            <img
                                src={item.img}
                                alt={item.name}
                                style={{
                                    width: "60px",
                                    height: "60px",
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
                                            height: "6px",
                                            background: "red",
                                            transform: "rotate(45deg)",
                                            position: "absolute",
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "6px",
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

            {/* Boots */}
            <div style={{marginTop: "20px"}}>
                <h3>Boots:</h3>
                <div style={{display: "flex", gap: "10px"}}>
                    {boots.map((boot) => (
                        <img
                            key={boot.name}
                            src={boot.img}
                            alt={boot.name}
                            style={{
                                width: "60px",
                                height: "60px",
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
            <div style={{marginTop: "20px"}}>
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
                                    width: "60px",
                                    height: "60px",
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
            <div style={{marginTop: "20px", marginBottom:"300px"}}>
                <h3>Build Roster:</h3>
                <div style={{display: "flex", gap: "8px"}}>
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
    );
}
