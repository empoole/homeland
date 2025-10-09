import { useRef, useEffect } from "react";

/**
 *
 * The concept for the map is you spend resources to unlock new tiles
 * tiles may contain new resources
 * you can only build so many buildings per tile unlocked
 * far off tiles are more expensive
 *
 * you can "prestige" to unlock a larger map (more tiles more zoomed out)
 *
 */

const MapCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 400;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(50, 50, 100, 75); // x, y, width, height

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.strokeRect(180, 50, 80, 60);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{ border: "1px solid black" }}
    ></canvas>
  );
};

export default MapCanvas;
