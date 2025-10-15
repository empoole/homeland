export type GameState = {
  map: {
    totalExploredTiles: number;
    tiles: Tile[];  
  }
  resources: {
    wood: number;
    food: number;
    metals: number;
  };
  buildings: {
    home: number;
    houses: number;
    tenements: number;
    farms: number;
    mines: number;
    factories: number;
  };
  populations: {
    civilians: number;
    lumberjacks?: number;
    miners?: number;
    builders?: number;
    farmers?: number;
  };
  populationMeta: {
    maxPop: number;
    civilianGrowthProbability: number;
    maxRandomGrowth: number;
  };
  locks: {
    mines: boolean;
    tenements: boolean;
    factories: boolean;
    metals: boolean;
  };
  multipliers: {
    home: number;
    farms: number;
    mines: number;
  }
};

export type TilesTypes = "blank" | "highlighted" | "home" | "mines" | "houses" | "farms";
export type Tile = {
  id: string;
  type: TilesTypes;
  explored: boolean;
};

// base resource multiplier per generator
export const baseMultipliers = {
  "home": 0.15,
  "farms": 0.25,
  "mines": 0.2,
} as const

export type GameStateKeys<T extends keyof GameState> = keyof GameState[T];

export type ResourceName = GameStateKeys<"resources">;
export type BuildingName = GameStateKeys<"buildings">;
export type LockName = GameStateKeys<"locks">;
export type PopulationType = GameStateKeys<"populations">;
