import React, { useRef, useState, useEffect } from "react";
import "./styles.css";

export default function KanjiCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
    const [lineWidth, setLineWidth] = useState<number>(() => {
        const savedWidth = localStorage.getItem("lineWidth");
        return savedWidth ? Number(savedWidth) : 3;
    });
    const [color, setColor] = useState(() => {
        const savedColor = localStorage.getItem("color");
        return savedColor || "black";
    });

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        canvas.width = 300;
        canvas.height = 300;
        drawGrid(ctx);
        const canvasCurrent = canvasRef.current;
        if (!canvasCurrent) return;

        const preventDefault = (e: TouchEvent) => e.preventDefault();

        // Prevent scrolling when touching the canvas
        canvasCurrent.addEventListener("touchstart", preventDefault, {
            passive: false,
        });
        canvasCurrent.addEventListener("touchmove", preventDefault, {
            passive: false,
        });

        return () => {
            canvasCurrent.removeEventListener("touchstart", preventDefault);
            canvasCurrent.removeEventListener("touchmove", preventDefault);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem("lineWidth", String(lineWidth));
    }, [lineWidth]);

    useEffect(() => {
        localStorage.setItem("color", color);
    }, [color]);

    const drawGrid = (ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(150, 0);
        ctx.lineTo(150, 300);
        ctx.moveTo(0, 150);
        ctx.lineTo(300, 150);
        ctx.stroke();
    };

    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const client = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
        // scale mouse position to canvas coordinates
        const x =
            ((client.clientX - rect.left) / rect.width) *
            canvasRef.current!.width;
        const y =
            ((client.clientY - rect.top) / rect.height) *
            canvasRef.current!.height;

        return { x, y };
    };

    const startDraw = (
        e:
            | React.MouseEvent<HTMLCanvasElement>
            | React.TouchEvent<HTMLCanvasElement>
    ) => {
        const pos = getPos(e);
        setPoints([pos]);
        setIsDrawing(true);
    };

    const endDraw = () => {
        setIsDrawing(false);
        setPoints([]);
    };

    const draw = (
        e:
            | React.MouseEvent<HTMLCanvasElement>
            | React.TouchEvent<HTMLCanvasElement>
    ) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current!.getContext("2d")!;
        const pos = getPos(e);
        const newPoints = [...points, pos];

        if (newPoints.length < 4) {
            setPoints(newPoints);
            return;
        }

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;

        ctx.beginPath();

        // take last 4 points for Catmull-Rom interpolation
        const [p0, p1, p2, p3] = newPoints.slice(-4);

        // Catmull-Rom → Cubic Bezier conversion
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        ctx.moveTo(p1.x, p1.y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        ctx.stroke();

        setPoints(newPoints);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx);
    };

    return (
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
            <canvas
                ref={canvasRef}
                style={{
                    border: "3px solid grey",
                    width: "80%",
                    maxWidth: "25rem",
                }}
                onMouseDown={startDraw}
                onMouseUp={endDraw}
                onMouseMove={draw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
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
    );
}
