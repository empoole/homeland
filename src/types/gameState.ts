export type GameState = {
  maxPop: number;
  totalExploredTiles: number;
  resources: {
    wood: number;
    food: number;
    metals: number;
  };
  buildings: {
    houses: number;
    tenements: number;
    farms: number;
    mines: number;
    factories: number;
  };
  populations: {
    civilians: number;
    migrants: number;
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
