import type { CSSProperties } from "react";
import KanjiCanvas from "./KanjiCanvas";

export default function App() {

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

    return (
        <div style={pageStyle}>
            <h1 style={titleStyle}>Kanji Area</h1>
            <KanjiCanvas />
        </div>
    );
}
