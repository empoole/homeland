export type Coordinate = {
  x: number;
  y: number;
};

// Define the state of a single tile
export type MapTileData = Coordinate & {
  id: string;
  type: "grass" | "water" | "mountain";
  status: "unexplored" | "visited" | "next-to-visit";
  resourceCost: {
    food: number; // you always need some amount of food to explore
    wood?: number; // sometimes you need other things, maybe we can add exploration gear at a later stage
    metals?: number;
  };
};

// Define the state of the entire map
export type MapState = {
  grid: Map<string, MapTileData>;
  mapSize: number; // Current side length (e.g., 5 means a 5x5 map)
  lastVisitedTileId: string; // Used to track where the player is expanding from
};

export type ResourceState = {
  food: number;
};
