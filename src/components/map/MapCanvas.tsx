import { useRef, useState, useEffect } from "react";
import useFrameTimeInterval from "../../hooks/useFrameTimeInterval";
import { exploreTile } from "../../slices/GameState";
import type { Tile, TilesTypes } from "../../types/gameState";

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

const TILE_SIZE = 32;
const MAP_WIDTH = 10;
const MAP_HEIGHT = 10;

type TileData = Record<string, Tile>;
const createTile = (
  explored: boolean,
  type: TilesTypes,
  id: string
): Tile => ({
  id,
  type,
  explored,
});

const generateTileData = (mapWidth: number, mapHeight: number) => {
  const data = [];
  const tiles: TileData = {};
  for (let h = 0; h < mapHeight; h++) {
    const row = [];
    for (let w = 0; w < mapWidth; w++) {
      tiles[`${h}-${w}`] = createTile(false, "blank", `${h}-${w}`);
      row.push(0);
    }
    data.push(row);
  }
  return { tiles, data };
};

const generateStartLocation = (mapWidth: number, mapHeight: number) => {
  const startX = Math.trunc(Math.random() * mapWidth);
  const startY = Math.trunc(Math.random() * mapHeight);
  return [startX, startY];
};

const { tiles, data } = generateTileData(MAP_WIDTH, MAP_HEIGHT);

const tilemapData: Tilemap = {
  width: MAP_WIDTH,
  height: MAP_HEIGHT,
  tileSize: TILE_SIZE,
  data: data,
};

const [startX, startY] = generateStartLocation(MAP_WIDTH, MAP_HEIGHT);

tilemapData.data[startX][startY] = 2;
tiles[`${startX}-${startY}`].type = "home";
exploreTile(`${startX}-${startY}`);

const tilesetImage = new Image();
tilesetImage.src = "/tileset.png";

tilesetImage.onerror = () => {
  console.error("Failed to load tileset image.");
};

// end test

const MapCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const CANVAS_WIDTH = 320;
  const CANVAS_HEIGHT = 320;
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = initCanvas(canvas);
    if (!context) return;
    setCtx(context);
  }, []);

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
        const sourceX =
          (tileId % (tileset.width / map.tileSize)) * map.tileSize;
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

  const handleCanvasClick = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const gridX = Math.floor(clickX / TILE_SIZE);
    const gridY = Math.floor(clickY / TILE_SIZE);

    if (gridX >= 0 && gridX < MAP_WIDTH && gridY >= 0 && gridY < MAP_HEIGHT) {
      // Call the map exploration handler
      // onTileClick({ x: gridX, y: gridY });
      // This should actually do the following:
      // check resource levels
      // if you have enough
      // show loading tile (1)
      // get random tile
      // show random tile
      // grant tile related reward
      // most tiles should be blank
      // -----
      // mines give you metal generation
      // forests give you wood generation
      // blank spaces can be made into farms for food generation
      // blank spaces can be dedicated to buildings, allowing up to 5 buildings to be added
      if (!tiles[`${gridY}-${gridX}`].explored) {
        tilemapData.data[gridY][gridX] = 1;
        exploreTile(`${gridY}-${gridX}`);
        setTimeout(() => {
          tilemapData.data[gridY][gridX] = Math.trunc(Math.random() * 2 + 4);
        }, 1000);
      }
    }
  };
  useFrameTimeInterval(100, () => drawMap(ctx, tilemapData, tilesetImage));

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{ border: "2px solid #b8c2b9" }}
      onClick={handleCanvasClick}
    ></canvas>
  );
};

interface Tilemap {
  width: number; // Map width in tiles
  height: number; // Map height in tiles
  tileSize: number; // Size of each tile in pixels
  data: number[][]; // 2D array representing the map, storing tile IDs
}

export default MapCanvas;
