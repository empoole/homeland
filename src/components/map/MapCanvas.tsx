import React, { useRef, useState, useEffect } from "react";

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
// test
const tilemapData: Tilemap = {
  width: 10,
  height: 10,
  tileSize: 32, // Example tile size
  data: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

const tilesetImage = new Image();
tilesetImage.src = "/tileset.png";

// tilesetImage.onload = () => {
//   // Tileset loaded, now you can start drawing
//   drawMap(tilemapData, tilesetImage);
// };

tilesetImage.onerror = () => {
  console.error("Failed to load tileset image.");
};

//test

const MapCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 400;
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = initCanvas(canvas);
    if (!context) return;
    setCtx(context);
  }, []);

  drawMap(ctx, tilemapData, tilesetImage);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{ border: "2px solid #b8c2b9" }}
    ></canvas>
  );
};

const initCanvas = (canvas: HTMLCanvasElement | null) => {
  if (!canvas) {
    console.error("Canvas not defined");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Unable to create context");
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  return ctx;
};

interface Tilemap {
  width: number; // Map width in tiles
  height: number; // Map height in tiles
  tileSize: number; // Size of each tile in pixels
  data: number[][]; // 2D array representing the map, storing tile IDs
}

const drawMap = (
  ctx: CanvasRenderingContext2D | null,
  map: Tilemap,
  tileset: HTMLImageElement
) => {
  if (!ctx) return;

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const tileId = map.data[y][x];
      // Calculate source X, Y in the tileset based on tileId
      // Assuming a simple linear tileset for now
      const sourceX = (tileId % (tileset.width / map.tileSize)) * map.tileSize;
      const sourceY =
        Math.floor(tileId / (tileset.width / map.tileSize)) * map.tileSize;

      ctx.drawImage(
        tileset,
        sourceX,
        sourceY,
        map.tileSize,
        map.tileSize,
        x * map.tileSize,
        y * map.tileSize,
        map.tileSize,
        map.tileSize
      );
    }
  }
};

export default MapCanvas;
