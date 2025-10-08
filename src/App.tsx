import { useEffect, useState, type CSSProperties } from "react";
import KanjiCanvas from "./KanjiCanvas";
import { CiDark, CiLight } from "react-icons/ci";

export default function App() {
    const [lineWidth, setLineWidth] = useState(
        () => Number(localStorage.getItem("lineWidth")) || 3
    );
    const [color, setColor] = useState(
        () => localStorage.getItem("color") || "black"
    );
    const [isCanvasClear, setIsCanvasClear] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const pageStyle: CSSProperties = {
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
    };

    const titleStyle: CSSProperties = {
        textAlign: "center",
        color: "orange",
        letterSpacing: "0.2rem",
        fontSize: "2.5rem",
        padding: "2rem 0 0",
    };

    function clearCanvas() {
        setIsCanvasClear(true);
    }

    useEffect(() => {
        setIsCanvasClear(false);
    }, [isCanvasClear]);
    
    useEffect(() => {
        if (isDarkTheme) {
            document.body.style.backgroundColor = "black"
        } else {
            document.body.style.backgroundColor = "white"
        }
    }, [isDarkTheme])

    return (
        <div style={pageStyle}>
            <h1 style={titleStyle}>Kanji Area</h1>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2rem",
                    flex: "1",
                    justifyContent: "center",
                }}
            >
                <KanjiCanvas
                    lineWidth={lineWidth}
                    color={color}
                    clear={isCanvasClear}
                />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                    }}
                >
                    <input
                        type="range"
                        min="1"
                        max="30"
                        value={lineWidth}
                        onChange={(e) => setLineWidth(Number(e.target.value))}
                    />
                    <span style={{ color: isDarkTheme ? "#fff" : "#000"}}>{lineWidth}px</span>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                    }}
                >
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                    <span style={{ color: isDarkTheme ? "#fff" : "#000"}}>{color}</span>
                </div>
                <button
                    style={{
                        border: "none",
                        padding: "0.5rem 1rem",
                        backgroundColor: "orange",
                        color: "white",
                        fontWeight: "bold",
                        letterSpacing: "0.2rem",
                        borderRadius: "2rem",
                    }}
                    onClick={clearCanvas}
                >
                    Clear
                </button>
                <button
                    style={{
                        position: "absolute",
                        bottom: "1rem",
                        right: "1rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "50%",
                        fontSize: "1.3rem",
                        color: isDarkTheme ? "#fff" : "#000",
                        backgroundColor: isDarkTheme ? "#000" : "#fff",
                        border: `1px solid ${isDarkTheme ? "#fff" : "#000"}`,
                    }}
                    onClick={() => setIsDarkTheme((theme) => !theme)}
                >
                    {isDarkTheme ? <CiLight /> : <CiDark />}
                </button>
            </div>
        </div>
    );
}
