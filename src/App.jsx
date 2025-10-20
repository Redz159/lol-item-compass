import {useEffect, useState} from "react";
import ItemCompass from "./LolItemCompass";
import BuildPlanner from "./BuildPlanner";
import { BuildProvider } from "./BuildContext";

export default function App() {
    const [activeTab, setActiveTab] = useState("compass");

    const tabSwitch = () => {
        setActiveTab((prev) => (prev === "compass" ? "planner" : "compass"));
    };

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key.toLowerCase() === "q") {
                tabSwitch();
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);


    return (
        <BuildProvider>
            <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-start items-start p-4">
                {/* Tab-Leiste */}
                <div style={{display: 'flex', gap: '8px', marginLeft: '18px', marginBottom: '8px'}}>
                    <button
                        onClick={() => setActiveTab("compass")}
                        className={`px-4 py-2 rounded-xl transition ${
                            activeTab === "compass" ? "bg-blue-600 text-white" : "bg-gray-700 hover:bg-gray-600"
                        }`}
                    >
                        Item Compass (Q)
                    </button>

                    <button
                        onClick={() => setActiveTab("planner")}
                        className={`px-4 py-2 rounded-xl transition ${
                            activeTab === "planner" ? "bg-blue-600 text-white" : "bg-gray-700 hover:bg-gray-600"
                        }`}
                    >
                        Build Planner (Q)
                    </button>
                </div>

                {/* Inhalt */}
                <div className="w-full max-w-5xl ml-0">
                    {activeTab === "compass" && <ItemCompass />}
                    {activeTab === "planner" && <BuildPlanner />}
                </div>
            </div>
        </BuildProvider>
    );
}
