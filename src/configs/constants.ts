export const TILE_SIZE = 32;
export const MAP_WIDTH = 10;
export const MAP_HEIGHT = 10;

// base resource multiplier per generator
export const baseBuildingMultipliers = {
    "home": 0.15,
    "forests": 0.15,
    "farms": 0.25,
    "mines": 0.2,
    "houses": 1,
    "tenements": 1,
    "factories": 1
} as const
  
export const baseMapProbabilities = {
    blank: .7,
    forests: .12,
    water: .1,
    mines: .08,
} as const

export const mapBuildingToResource = {
    home: ["food", "wood"],
    farms: ["food"],
    mines: ["metals"],
    forests: ["wood"],
    houses: [],
    tenements: [],
    factories: [],
  } as const;
  
  export const mapResourceToBuilding = {
    wood: ["home", "forests"],
    food: ["home", "farms"],
    metals: ["mines"],
  } as const;
  