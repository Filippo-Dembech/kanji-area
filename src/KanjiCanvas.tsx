import React, { useRef, useEffect } from "react";
import "./styles.css";

interface KanjiCanvasProps {
    lineWidth: number;
    color: string;
    clear: boolean
}

export default function KanjiCanvas({ lineWidth, color, clear }: KanjiCanvasProps) {
    console.log("canvas only one");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const points = useRef<{ x: number; y: number }[]>([]);


    const drawGrid = React.useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(150, 0);
        ctx.lineTo(150, 300);
        ctx.moveTo(0, 150);
        ctx.lineTo(300, 150);
        ctx.stroke();
    }, []);

    const clearCanvas = React.useCallback(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx);
    }, [drawGrid]);

    useEffect(() => {
        if (clear) {
            clearCanvas()
        }
    }, [clear, clearCanvas])


    const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const { clientX, clientY } = e;
        // scale mouse position to canvas coordinates
        const x =
            ((clientX - rect.left) / rect.width) * canvasRef.current!.width;
        const y =
            ((clientY - rect.top) / rect.height) * canvasRef.current!.height;

        return { x, y };
    };

    const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
        isDrawing.current = true;
        points.current = [getPos(e)]
    };

    const endDraw = () => {
        isDrawing.current = false;
        points.current = [];
    };

    const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawing.current) return;
        const ctx = canvasRef.current!.getContext("2d", { alpha: false })!;
        const pos = getPos(e);
        points.current.push(pos);

        if (points.current.length < 4) return;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;

        // take last 4 points for Catmull-Rom interpolation
        const [p0, p1, p2, p3] = points.current.slice(-4);

        // Catmull-Rom → Cubic Bezier conversion
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        ctx.stroke();

    };

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
    }, [drawGrid]);

    useEffect(() => {
        localStorage.setItem("lineWidth", String(lineWidth));
    }, [lineWidth]);

    useEffect(() => {
        localStorage.setItem("color", color);
    }, [color]);


    return (
            <canvas
                ref={canvasRef}
                style={{
                    border: "3px solid grey",
                    width: "80%",
                    maxWidth: "25rem",
                }}
                onPointerDown={startDraw}
                onPointerMove={draw}
                onPointerUp={endDraw}
            />
    );
}
