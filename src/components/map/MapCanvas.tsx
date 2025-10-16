import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useFrameTimeInterval from "../../hooks/useFrameTimeInterval";
import { exploreTile } from "../../slices/GameState";
import { TILE_SIZE, MAP_HEIGHT, MAP_WIDTH } from "../../configs/constants";
import type { RootState } from "../../store";
import type { Tile } from "../../types/gameState";


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
  const dispatch = useDispatch();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const CANVAS_WIDTH = 320;
  const CANVAS_HEIGHT = 320;
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // test
  interface Tilemap {
    width: number; // Map width in tiles
    height: number; // Map height in tiles
    tileSize: number; // Size of each tile in pixels
    tiles: Tile[][]; // 2D array representing the map, storing tile IDs
  }

  const tilesState = useSelector((state: RootState) => state.gameState).map.tiles;

  const tilemapData: Tilemap = {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    tileSize: TILE_SIZE,
    tiles: tilesState,
  };

  const tilesetImage = new Image();
  tilesetImage.src = "/tileset.png";

  tilesetImage.onerror = () => {
    console.error("Failed to load tileset image.");
  };
  // end test

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
        const tile = map.tiles[y][x];
        // 8 is the unexplored tile type
        const tileType = tile.explored ? tile.type : 8;
        const sourceX =
          (tileType % (tileset.width / map.tileSize)) * map.tileSize;
        const sourceY =
          Math.floor(tileType / (tileset.width / map.tileSize)) * map.tileSize;

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
      // grant tile related reward
      // -----
      // mines give you metal generation
      // forests give you wood generation
      // blank spaces can be made into farms for food generation
      // blank spaces can be dedicated to buildings, allowing up to 5 buildings to be added  
      if (!tilesState[gridY][gridX].explored) {
        // draw loading tile (type 9)
        setTimeout(() => {
          dispatch(exploreTile({tileY: gridY, tileX: gridX}));
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



export default MapCanvas;
