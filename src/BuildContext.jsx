// BuildContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { items } from "./items";
import champData from "./assets/champs.json";

const BuildContext = createContext();

const parsePickrate = (pickrateStr) => parseFloat((pickrateStr || "").toString().replace("%", "")) || 0;

// erzeugt ein Team mit Rücksicht auf ein Set "used" (um Duplikate zu verhindern)
const generateTeam = (roleOrder = ["Top","Jungle","Mid","AD Carry","Support"], usedSet = new Set(), forceLastBard = false) => {
    const pickChampion = (role) => {
        const pool = champData.filter(c => c.Role === role && !usedSet.has(c.Name));
        if (pool.length === 0) return { Name: "MissingNo", Role: role, Pickrate: "0%" };
        const total = pool.reduce((s, c) => s + parsePickrate(c.Pickrate), 0);
        let rand = Math.random() * total;
        for (const champ of pool) {
            rand -= parsePickrate(champ.Pickrate);
            if (rand <= 0) {
                usedSet.add(champ.Name);
                return champ;
            }
        }
        // fallback
        const fallback = pool[Math.floor(Math.random() * pool.length)];
        usedSet.add(fallback.Name);
        return fallback;
    };

    const team = roleOrder.map(role => pickChampion(role));

    if (forceLastBard) {
        const bard = champData.find(c => c.Name === "Bard");
        if (bard) {
            // falls Bard schon verwendet wurde, entfernen wir die frühere Verwendung, ansonsten adden wir
            usedSet.add("Bard");
            team[4] = bard;
        } else {
            team[4] = { Name: "Bard", Role: "Support", Pickrate: "0%" };
            usedSet.add("Bard");
        }
    }

    return { team, usedSet };
};

export const BuildProvider = ({ children }) => {
    // LolItemCompass Filters
    const [filtersEnabled, setFiltersEnabled] = useState(true);
    const [selectedFilters, setSelectedFilters] = useState([]);

    // BuildPlanner State
    const [viableItems, setViableItems] = useState([]);
    const [excludedItems, setExcludedItems] = useState([]);
    const [buildRoster, setBuildRoster] = useState([
        { name: "Bloodsong", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3877.png", fixed: true },
        { name: "Dead Man's Plate", img: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3742.png", fixed: true },
        null,
        null,
        null,
        null,
    ]);
    const [selectedBoot, setSelectedBoot] = useState(null);

    // Teams: initial leer, werden einmalig beim Provider-Mount erzeugt
    const [team1, setTeam1] = useState([]);
    const [team2, setTeam2] = useState([]);

    useEffect(() => {
        // erzeugen mit gemeinsamem used-Set, damit keine doppelten Champs über beide Teams entstehen
        const used = new Set();
        const roles = ["Top","Jungle","Mid","AD Carry","Support"];

        // Team1 (force Bard as last slot)
        const { team: t1, usedSet: usedAfterT1 } = generateTeam(roles, used, true);

        // Team2 (weiterhin aus demselben usedSet, damit keine Duplikate zwischen Teams)
        const { team: t2 } = generateTeam(roles, usedAfterT1, false);

        setTeam1(t1);
        setTeam2(t2);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // nur einmal beim Mount

    return (
        <BuildContext.Provider
            value={{
                filtersEnabled, setFiltersEnabled,
                selectedFilters, setSelectedFilters,
                viableItems, setViableItems,
                excludedItems, setExcludedItems,
                buildRoster, setBuildRoster,
                selectedBoot, setSelectedBoot,
                team1, setTeam1,
                team2, setTeam2,
                items,
                // expose helper: eine Funktion, die beide teams neu randomized und Duplikate verhindert
                randomizeBothTeams: () => {
                    const used = new Set();
                    const roles = ["Top","Jungle","Mid","AD Carry","Support"];
                    const { team: newT1, usedSet } = generateTeam(roles, used, true);
                    const { team: newT2 } = generateTeam(roles, usedSet, false);
                    setTeam1(newT1);
                    setTeam2(newT2);
                }
            }}
        >
            {children}
        </BuildContext.Provider>
    );
};

export const useBuild = () => useContext(BuildContext);
