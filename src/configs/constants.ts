export const TILE_SIZE = 32;
export const MAP_WIDTH = 10;
export const MAP_HEIGHT = 10;

// base resource multiplier per generator
export const baseBuildingMultipliers = {
	home: 0.15,
	forests: 0.15,
	water: 0.1,
	farms: 0.25,
	mines: 0.2,
	houses: 1,
	tenements: 1,
	factories: 1,
} as const;

export const baseMapProbabilities = {
	blank: 0.7,
	forests: 0.12,
	water: 0.1,
	mines: 0.08,
} as const;

export const mapBuildingToResource = {
	home: ["food", "wood"],
	farms: ["food"],
	mines: ["metals"],
	forests: ["wood", "food"],
	water: ["food"],
	houses: [],
	tenements: [],
	factories: [],
} as const;

export const mapResourceToBuilding = {
	wood: ["home", "forests"],
	food: ["home", "forests", "farms", "water"],
	metals: ["mines"],
} as const;

export const populationLimitIncreasesByBuilding = { houses: 5, tenements: 15 } as const;

export const TileTypes = [
    "empty",
    "forests",
    "water",
    "mines",
    undefined,
    undefined,
    undefined,
    undefined,
    "unexplored",
    "loading",
    "home",
    undefined,
    "outposts",
    "farms",
    undefined,
    undefined
] as const;