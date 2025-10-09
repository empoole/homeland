/**
 *
 * THIS IS VIBE CODED
 * GONNA NEED A LOT OF WORK HERE, ITS JUST A START
 *
 */

import type { MapTileData, MapState } from "../../types/map-V";

// Helper function to create a unique ID
const getTileId = (x: number, y: number) => `${x}-${y}`;

/**
 * Creates the initial map grid or a new layer when scaling up.
 * @param size The current size of the map (e.g., 5 for a 5x5 grid centered at (0,0))
 * @param existingGrid Optional: the current grid to add new tiles to
 */
export const initializeMapGrid = (
  size: number,
  existingGrid = new Map<string, MapTileData>()
) => {
  // The map will be centered around (0,0). Coordinates range from -floor(size/2) to floor(size/2)
  const halfSize = Math.floor(size / 2);

  for (let x = -halfSize; x <= halfSize; x++) {
    for (let y = -halfSize; y <= halfSize; y++) {
      const id = getTileId(x, y);

      // Only generate a new tile if it doesn't already exist
      if (!existingGrid.has(id)) {
        const newTile: MapTileData = {
          x,
          y,
          id,
          type: Math.random() < 0.2 ? "water" : "grass", // 20% chance of water
          status: "unexplored",
          resourceCost: {
            food: Math.floor(Math.random() * 10) + 5, // Random cost 5-14
          },
        };
        existingGrid.set(id, newTile);
      }
    }
  }

  // Set the very center tile to be the starting point (visited)
  const startTileId = getTileId(0, 0);
  if (existingGrid.has(startTileId)) {
    const startTile = existingGrid.get(startTileId)!;
    startTile.status = "visited";
    startTile.resourceCost = { food: 0 }; // Free to start
  }

  return existingGrid;
};

// mapGenerator.ts (or where you initialize the map)

const INITIAL_MAP_SIZE = 5;

// Helper to define a tile quickly
const createTile = (
  x: number,
  y: number,
  status: "unexplored" | "visited" | "next-to-visit",
  type: "grass" | "water",
  foodCost: number
) => ({
  x,
  y,
  id: `${x}-${y}`,
  type,
  status,
  resourceCost: foodCost > 0 ? { food: foodCost } : {},
});

// Create the initial grid (5x5 map from coordinates -2 to 2)
const initialGrid = new Map<string, MapTileData>();

// --- CENTER TILE (START) ---
initialGrid.set("0-0", createTile(0, 0, "visited", "grass", 0));

// --- IMMEDIATE NEIGHBORS (NEXT TO VISIT) ---
// These would be set by the generateNextTiles function after initialization
initialGrid.set("1-0", createTile(1, 0, "next-to-visit", "grass", 10));
initialGrid.set("-1-0", createTile(-1, 0, "next-to-visit", "grass", 8));
initialGrid.set("0-1", createTile(0, 1, "next-to-visit", "grass", 12));
initialGrid.set("0--1", createTile(0, -1, "next-to-visit", "water", 20)); // Water tile costs more

// --- FURTHER UNEXPLORED TILES (just a few examples) ---
initialGrid.set("2-2", createTile(2, 2, "unexplored", "grass", 15));
initialGrid.set("-2-1", createTile(-2, 1, "unexplored", "grass", 9));

// (The remaining 19 tiles are also initialized, mostly 'unexplored')

export const initialMapState: MapState = {
  mapSize: INITIAL_MAP_SIZE, // 5 (for a 5x5 grid)
  grid: initialGrid, // The fully populated Map
  lastVisitedTileId: "0-0",
};
