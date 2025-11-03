export default function HowToUse() {
    return (
        <div
            style={{
                backgroundColor: "#0f0f0f",
                color: "white",
                padding: "24px",
                borderRadius: "16px",
                maxWidth: "800px",
                margin: "0 auto",
                boxShadow: "0 0 15px rgba(0,0,0,0.5)",
                lineHeight: "1.6",
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    fontSize: "28px",
                    fontWeight: "bold",
                    marginBottom: "24px",
                }}
            >
                How to Use
            </h1>

            <p style={{ textAlign: "center", marginBottom: "24px", fontSize: "16px" }}>
                Press <span style={{ color: "#4da6ff", fontWeight: "bold" }}>"Q"</span> to quickly toggle between{" "}
                <span style={{ color: "#5dbbff", fontWeight: "bold" }}>LoL Item Compass</span> and{" "}
                <span style={{ color: "#c97fff", fontWeight: "bold" }}>Item Build Planner</span>!
            </p>

            {/* Item Compass */}
            <h2
                style={{
                    color: "#4da6ff",
                    fontSize: "22px",
                    marginBottom: "8px",
                    marginTop: "20px",
                }}
            >
                In Item Compass:
            </h2>
            <ul style={{ marginLeft: "24px", marginBottom: "16px" }}>
                <li>You can click on the items for a little description.</li>
                <li>You can enable filters, which highlight an item the more categories it matches.</li>
                <li>
                    You can press <span style={{ color: "#ffcc00", fontWeight: "bold"  }}>"R"</span> to reset the filters.
                </li>
            </ul>

            {/* Build Planner */}
            <h2
                style={{
                    color: "#c97fff",
                    fontSize: "22px",
                    marginBottom: "8px",
                    marginTop: "20px",
                }}
            >
                In Build Planner:
            </h2>
            <ul style={{ marginLeft: "24px", marginBottom: "16px" }}>
                <li>
                    Press <span style={{ color: "#ffcc00", fontWeight: "bold"  }}>"1"</span> to go into{" "}
                    <span style={{ color: "#80ff80", fontWeight: "bold"  }}>adding mode</span>, where you can click on items to add
                    them to viable items.
                </li>
                <li>
                    Press <span style={{ color: "#ffcc00", fontWeight: "bold"  }}>"2"</span> to go into {" "}
                    <span style={{ color: "#ff6666", fontWeight: "bold"  }}>excluding mode</span>, where you can cross out items you don’t want to go.
                </li>
                <li>
                    Press <span style={{ color: "#ffcc00", fontWeight: "bold"  }}>"R"</span> to reset all items.
                </li>
                <li>
                    Randomize your/enemy team with pickrate-accurate randomization or click on champs to replace them manually.
                </li>
                <li>
                    Swap <span style={{ color: "#ff6666", fontWeight: "bold" }}>Bloodsong</span> ↔{" "}
                    <span style={{ color: "#ff6666", fontWeight: "bold" }}>Solstice Sleigh</span> by clicking on it.
                </li>
            </ul>

            {/* What to use for */}
            <h2
                style={{
                    color: "#80ff80",
                    fontSize: "22px",
                    marginBottom: "8px",
                    marginTop: "20px",
                }}
            >
                What to use it for:
            </h2>
            <ul style={{ marginLeft: "24px", marginBottom: "16px" }}>
                <li>In champ select or loading screen, quickly scout and prepare an ideal item build.</li>
                <li>Practice building with the randomizer.</li>
                <li>After game review — did you build right?</li>
            </ul>

            {/* Known bugs */}
            <h2
                style={{
                    color: "#ff6666",
                    fontSize: "22px",
                    marginBottom: "8px",
                    marginTop: "20px",
                }}
            >
                Known Bugs:
            </h2>
            <ul style={{ marginLeft: "24px", marginBottom:"50px" }}>
                <li>Search bar is a bit buggy but works fine for now.</li>
                <li>
                    While searching for champs, pressing{" "}
                    <span style={{ color: "#ffcc00", fontWeight: "bold" }}>"Q"</span> or{" "}
                    <span style={{ color: "#ffcc00", fontWeight: "bold" }}>"R"</span> might still trigger hotkeys
                    (especially annoying with Qiyana or Quinn, but who likes them anyway tbh 😀).
                </li>
            </ul>
        </div>
    );
}
