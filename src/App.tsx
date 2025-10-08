import { useEffect, useState, type CSSProperties } from "react";
import KanjiCanvas from "./KanjiCanvas";

export default function App() {

    const [lineWidth, setLineWidth] = useState(() => Number(localStorage.getItem("lineWidth")) || 3);
    const [color, setColor] = useState(() => localStorage.getItem("color") || "black");
    const [isCanvasClear, setIsCanvasClear] = useState(false);

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
    }, [isCanvasClear])

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
                <KanjiCanvas lineWidth={lineWidth} color={color} clear={isCanvasClear}/>
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
                        onChange={(e) =>
                            (setLineWidth(Number(e.target.value)))
                        }
                    />
                    <span>{lineWidth}px</span>
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
                    <span>{color}</span>
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
            </div>
        </div>
    );
}
