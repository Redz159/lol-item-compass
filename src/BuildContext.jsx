// BuildContext.jsx
import React, { createContext, useContext, useState } from "react";
import { items } from "./items";

const BuildContext = createContext();

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

    // Teams State
    const [team1, setTeam1] = useState([]);
    const [team2, setTeam2] = useState([]);

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
            }}
        >
            {children}
        </BuildContext.Provider>
    );
};

export const useBuild = () => useContext(BuildContext);
