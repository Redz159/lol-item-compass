
import React, { useState, useEffect } from "react";
import { starter, bootsStats, legendary } from "./assets/itemStats.jsx";
import runesData from "./assets/runesReforged.json";
import { useBuild } from "./BuildContext";
import { items } from "./assets/items.js";
import champData from "./assets/champs.json";
import Diadem from "../images/Diadem.png";
import Bandlepipes from "../images/Bandlepipes.png";


const boots = [
    { name: "Boots of Speed", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3009.png" },
    { name: "Mercury's Treads", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3111.png" },
    { name: "Plated Steelcaps", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3047.png" },
    { name: "Ionian Boots of Lucidity", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3158.png" },
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
    const joatValue = calculateJoaT(buildRoster, selectedBoot);

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
        // Reset everything
        setViableItems([]);
        setExcludedItems([]);
        setSelectedBoot(null);

        // Set build Roster to default
        switchToRuneSetup("Dom,1,1,3,1,Insp,1-2,3-3, Default very reliable")
        const defaultRoster = [
            { name: "Bloodsong", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3877.png", fixed: true },
            null,
            null,
            null,
            null,
            null,
        ];
        setBuildRoster(defaultRoster);
    };
    const handleEnchanter = () => {
        //setViableItems([]);
        //setExcludedItems([]);
        setSelectedBoot("Boots of Speed");

        // Setze Build Roster mit Default-Regeln
        const enchanterDefaultRoster = [
            { name: "Bloodsong", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3877.png", fixed: true },
            { name: "Echoes of Helia", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6620.png", fixed: true },
            { name: "Boots of Speed", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3009.png", fixed: true },
            { name: "Diadem of Songs", img: Diadem, fixed: true },
            null,
            null,
        ];
        switchToRuneSetup("Dom,1,1,3,1,Insp,1-2,3-3, Default very reliable")
        setBuildRoster(enchanterDefaultRoster);
    };
    const handleBruiser = () => {
        //setViableItems([]);
        //setExcludedItems([]);
        setSelectedBoot(null);

        // Set Bruiser Build
        const bruiserDefaultRoster = [
            { name: "Celestial Opposition", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3869.png", fixed: true },
            { name: "Dusk and Dawn", img: "https://ddragon.leagueoflegends.com/cdn/16.3.1/img/item/2510.png", fixed: true },
            null,
            null,
            null,
            null,
        ];

        switchToRuneSetup("Prec,1,2,1,2,Insp,1-2,3-3, Dusk&Dawn Fun build")
        setBuildRoster(bruiserDefaultRoster);
    };
    const handleDefault = () => {
        //setViableItems([]);
        //setExcludedItems([]);
        setSelectedBoot(null);

        // Setze Build Roster mit Default-Regeln
        const tankDefaultRoster = [
            { name: "Bloodsong", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3877.png", fixed: true },
            { name: "Dead Man's Plate", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3742.png", fixed: true },
            { name: "Bandlepipes", img: Bandlepipes, fixed: true },
            null,
            null,
            null,
        ];
        switchToRuneSetup("Dom,1,1,3,1,Insp,1-2,3-3, Default very reliable")
        setBuildRoster(tankDefaultRoster);
    };



    function calculateJoaT(buildRoster, selectedBoot) {
        if (!buildRoster) return 0;

        const statSet = new Set();

        // Starter Slot 1 immer vorhanden
        const starterItem = starter[0];
        starterItem[1].forEach(s => statSet.add(s));

        // Boots
        if (selectedBoot) {
            const bootItem = bootsStats.find(b => b[0] === selectedBoot);
            if (bootItem) {
                bootItem[1].forEach(s => statSet.add(s));
            }
        }

        // Legendary items aus buildRoster
        buildRoster.forEach(item => {
            if (!item || !item.name) return;

            const leg = legendary.find(l => l[0] === item.name);
            if (leg) {
                leg[1].forEach(s => statSet.add(s));
            }
        });

        return statSet.size;
    }
    function getJoatStyle(value) {
        const max = 10;
        const clamped = Math.min(value, max);

        const ratio = clamped / max; // 0 → rot, 1 → grün

        // Farbverlauf Rot → Grün
        const r = Math.round(255 * (1 - ratio));
        const g = Math.round(255 * ratio);
        const b = 0;

        return {
            color: `rgb(${r}, ${g}, ${b})`,
            fontWeight: "bold",                  // immer fett
            textDecoration: value >= 10 ? "underline" : "none",
            transition: "color 0.3s ease, text-decoration 0.3s ease",
        };
    }

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


    const getTree = (keyShort) => {
        const map = {
            Dom: "Domination",
            Insp: "Inspiration",
            Sorc: "Sorcery",
            Prec: "Precision",
            Res: "Resolve"
        };

        return runesData.find(t => t.key === map[keyShort]);
    };

    const getRune = (tree, slotIndex, runeIndex) => {
        return tree?.slots?.[slotIndex]?.runes?.[runeIndex - 1];
    };

    const parseRuneString = (str) => {
        const parts = str.split(",");

        const [mainKey, k, s1, s2, s3, secKey, sec1, sec2, ...rest] = parts;

// 👉 alles nach dem 8. Feld = Tooltip (falls Kommas drin sind)
        const tooltip = rest.length > 0 ? rest.join(",") : null;

        const mainTree = getTree(mainKey);
        const secondaryTree = getTree(secKey);

        const [secSlot1, secRune1] = sec1.split("-").map(Number);
        const [secSlot2, secRune2] = sec2.split("-").map(Number);

        const keystone = getRune(mainTree, 0, Number(k));

        return {
            mainTree,
            secondaryTree,
            keystone,

            tooltip,

            selections: {
                keystone: Number(k),
                main: [Number(s1), Number(s2), Number(s3)],
                secondary: [
                    { slot: secSlot1, rune: secRune1 },
                    { slot: secSlot2, rune: secRune2 }
                ]
            }
        };
    };

    const groupByKeystone = (setups) => {
        const map = {};

        setups.forEach(s => {
            const parsed = parseRuneString(s);
            const key = parsed.keystone?.id; // besser als name!

            if (!map[key]) {
                map[key] = {
                    keystone: parsed.keystone,
                    setups: []
                };
            }

            map[key].setups.push({
                raw: s,
                parsed
            });
        });

        return Object.values(map);
    };

    const switchToRuneSetup = (setupString) => {
        const parsed = parseRuneString(setupString);

        if (!parsed?.keystone) return;

        // 1. passende Gruppe finden
        const group = grouped.find(g => g.keystone.id === parsed.keystone.id);
        if (!group) return;

        // 2. Index im Array finden
        const index = group.setups.findIndex(s => s.raw === setupString);
        if (index === -1) return;

        // 3. State setzen
        setSelectedKeystone(group.keystone.id);
        setSelectedIndex(index);
    };

    function RunePage({ setupString }) {
        const data = parseRuneString(setupString);

        if (!data.mainTree) return null;

        return (
            <div style={{
                display: "flex",
                gap: "20px",
                background: "#111",
                padding: "12px",
                borderRadius: "10px"
            }}>
                {/* PRIMARY */}
                <div>
                    <img
                        src={`https://ddragon.leagueoflegends.com/cdn/img/${data.mainTree.icon}`}
                        style={{ width: "40px", marginBottom: "10px" }}
                    />

                    {/* Keystone */}
                    <img
                        src={`https://ddragon.leagueoflegends.com/cdn/img/${data.keystone.icon}`}
                        style={{ width: "50px" }}
                    />

                    {/* 3 Main Runes */}
                    {data.mainRunes.map((r, i) => (
                        <img
                            key={i}
                            src={`https://ddragon.leagueoflegends.com/cdn/img/${r.icon}`}
                            style={{ width: "35px", display: "block", marginTop: "6px" }}
                        />
                    ))}
                </div>

                {/* SECONDARY */}
                <div>
                    <img
                        src={`https://ddragon.leagueoflegends.com/cdn/img/${data.secondaryTree.icon}`}
                        style={{ width: "40px", marginBottom: "10px" }}
                    />

                    {data.secondaryRunes.map((r, i) => (
                        <img
                            key={i}
                            src={`https://ddragon.leagueoflegends.com/cdn/img/${r.icon}`}
                            style={{ width: "35px", display: "block", marginTop: "6px" }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    const RuneIcon = ({ rune, active, size = 40 }) => {
        return (
            <img
                src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                alt={rune.name}
                style={{
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    filter: active ? "none" : "grayscale(100%) brightness(40%)",
                    opacity: active ? 1 : 0.5,
                    transition: "all 0.2s",
                    boxShadow: active ? "0 0 10px rgba(255,255,255,0.4)" : "none",
                }}
            />
        );
    };

    function RuneTree({ tree, selections, isPrimary }) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                background: "#0f0f0f",
                padding: "10px",
                borderRadius: "10px"
            }}>
                {/* Tree Icon */}
                <img
                    src={`https://ddragon.leagueoflegends.com/cdn/img/${tree.icon}`}
                    style={{ width: "50px", marginBottom: "5px"}}
                />

                {tree.slots.map((slot, slotIndex) => (
                    <div
                        key={slotIndex}
                        style={{
                            display: "flex",
                            gap: "8px",
                            justifyContent: "center",
                            //alignSelf: "flex-start"

                        }}
                    >
                        {slot.runes.map((rune, runeIndex) => {
                            let active = false;

                            if (isPrimary) {
                                if (slotIndex === 0) {
                                    active = selections.keystone === runeIndex + 1;
                                } else {
                                    active = selections.main[slotIndex - 1] === runeIndex + 1;
                                }
                            } else {
                                active = selections.secondary.some(
                                    s => s.slot === slotIndex && s.rune === runeIndex + 1
                                );
                            }

                            return (
                                <RuneIcon
                                    key={rune.id}
                                    rune={rune}
                                    active={active}
                                    size={slotIndex === 0 ? 60 : 42}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    }

    function RunePageFull({ setupString }) {
        const data = parseRuneString(setupString);
        if (!data) return null;

        return (


            <div style={{
                display: "flex",
                gap: "30px",
                background: "#111",
                padding: "15px",
                borderRadius: "12px",
                border: "1px solid #333",

            }}>
                {/* Tooltip */}
                <div style={{position: "relative"}}>
                    {data.tooltip && (
                        <div style={{
                            position: "absolute",
                            top: "5px",
                            left: "5px",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            background: "#EFC537",
                            color: "black",
                            fontSize: "18px",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            wordBreak: "normal",        // 🔥 wichtig!
                            overflowWrap: "normal",


                        }}
                             className="tooltip-wrapper"
                        >
                            ?
                            <div className="tooltip-box">
                                {data.tooltip}
                            </div>
                        </div>
                    )}

                </div>

                {/* PRIMARY */}
                <RuneTree
                    tree={data.mainTree}
                    selections={data.selections}
                    isPrimary={true}
                />

                {/* SECONDARY */}
                <RuneTree
                    tree={data.secondaryTree}
                    selections={data.selections}
                    isPrimary={false}
                />


            </div>

        );
    }

    const runeSetups = [
        "Dom,1,1,3,1,Insp,1-2,3-3, Default very reliable",
        "Dom,1,1,3,2,Insp,1-2,3-3, Also really good, ms can be overkill",
        "Prec,1,2,1,2,Insp,1-2,3-3, Dusk&Dawn Fun build",
        "Insp,2,2,3,3,Dom,2-3,3-2, Keria's Runepage - Really easy Lane, Not high Elec-Value",
        "Sorc,1,3,2,1,Dom,1-1,3-2, ———————REALLY EXPERIMENTAL———————— Only with with Enchanter (perma proc aeary through Diadem)",
        "Sorc,1,3,2,1,Dom,1-1,3-1, ———————REALLY EXPERIMENTAL———————— Only with with Enchanter (perma proc aeary through Diadem)",
        "Sorc,1,3,2,1,Res,1-2,3-2, ———————REALLY EXPERIMENTAL———————— Only with with Enchanter (perma proc aeary through Diadem)",
        "Sorc,1,3,2,1,Insp,1-2,3-1, ———————REALLY EXPERIMENTAL———————— Only with with Enchanter (perma proc aeary through Diadem)",
        "Sorc,1,3,2,1,Insp,1-2,3-3, ———————REALLY EXPERIMENTAL———————— Only with with Enchanter (perma proc aeary through Diadem)",
        "Res,3,2,3,3,Insp,1-2,3-3, Guardian not that good anymore",
        "Res,3,2,3,3,Dom,1-1,3-2, Guardian not that good anymore",
    ];

    const grouped = groupByKeystone(runeSetups);

    const [selectedKeystone, setSelectedKeystone] = useState(grouped[1]?.keystone.id);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const activeGroup = grouped.find(g => g.keystone.id === selectedKeystone);

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

                <button
                    onClick={handleDefault}
                    style={{
                        background: "linear-gradient(90deg, #915934, #EFF75A)",
                        border: "none",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        color: "black",
                        cursor: "pointer",
                        marginBottom: "12px",
                        marginLeft: "8px",
                    }}
                >
                    📯Default
                </button>

                <button
                    onClick={handleEnchanter}
                    style={{
                        background: "linear-gradient(90deg, #46ACFD, #52F2A4)",
                        border: "none",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        color: "black",
                        cursor: "pointer",
                        marginBottom: "12px",
                        marginLeft: "8px",
                    }}
                >
                    ❤️‍🩹 Enchanter
                </button>

                <button
                    onClick={handleBruiser}
                    style={{
                        background: "linear-gradient(90deg, #5259D8, #D2BE9F)",
                        border: "none",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        color: "black",
                        cursor: "pointer",
                        marginBottom: "12px",
                        marginLeft: "8px",
                    }}
                >
                    ⚔️ Bruiser
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
                    <h3 style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <span>Build Roster</span>
                        <div style={getJoatStyle(joatValue)}>
                            JoAT: {joatValue}
                        </div>
                    </h3>
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

        /* 🔥 TOOLTIP */
        .tooltip-wrapper {
            position: relative;
        }

        .tooltip-box {
            position: absolute;
            top: 30px;
            right: 0;
            background: #111;
            color: white;
            padding: 8px 10px;
            border-radius: 6px;
            font-size: 13px;
            max-width: 240px;
            white-space: normal;
            word-wrap: break-word;
            opacity: 0;
            pointer-events: none;
            transform: translateY(5px);
            transition: all 0.2s ease;
            border: 1px solid #333;
            z-index: 10;
        }

        .tooltip-wrapper:hover .tooltip-box {
            opacity: 1;
            transform: translateY(0);
        }
    `}
                </style>
            </div>

            {/* MITTLERE SPALTE (Runes UI) */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                minWidth: "300px",
                marginTop: "30px",
                marginRight: "120px",
                marginLeft: "110px",
            }}>

                {/* 🔝 Keystone Auswahl */}
                <div style={{display: "flex", gap: "12px", alignSelf: "flex-start"}}>
                    {grouped.map(group => (
                        <div
                            key={group.keystone.id}
                            onClick={() => {
                                setSelectedKeystone(group.keystone.id);
                                setSelectedIndex(0);
                            }}
                            style={{
                                padding: "8px",
                                borderRadius: "10px",
                                background: selectedKeystone === group.keystone.id ? "#222" : "#111",
                                border: selectedKeystone === group.keystone.id ? "2px solid #aaa" : "1px solid #333",
                                cursor: "pointer"
                            }}
                        >
                            <img
                                src={`https://ddragon.leagueoflegends.com/cdn/img/${group.keystone.icon}`}
                                style={{ width: "50px" }}
                            />
                        </div>
                    ))}
                </div>

                {/* 🔽 Varianten */}
                {activeGroup && (
                    <div style={{
                        display: "flex",
                        gap: "10px",
                        alignSelf: "flex-start" //
                    }}>
                        {activeGroup.setups.map((setup, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedIndex(idx)}
                                style={{
                                    padding: "6px 10px",
                                    borderRadius: "8px",
                                    background: selectedIndex === idx ? "#444" : "#222",
                                    cursor: "pointer",
                                    color: "white"

                                }}
                            >
                                {idx + 1}
                            </div>
                        ))}
                    </div>
                )}

                {/* Rune Anzeige */}
                {activeGroup && (
                    <RunePageFull setupString={activeGroup.setups[selectedIndex].raw} />
                )}

            </div>


            {/* Rechte Seite – Teams */}
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "40px",
                alignItems: "flex-start"
            }}>
                <TeamBlock title="Team 1" color="limegreen" team={team1} setTeam={setTeam1} otherTeam={team2} forceLastBard={true}/>
                <TeamBlock title="Team 2" color="crimson" team={team2} setTeam={setTeam2} otherTeam={team1}/>
            </div>

        </div>
    );


}