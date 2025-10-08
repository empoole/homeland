export type GameState = {
  maxPop: number;
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
};

export type GameStateKeys<T extends keyof GameState> = keyof GameState[T];

export type ResourceName = GameStateKeys<"resources">;
export type BuildingName = GameStateKeys<"buildings">;
export type LockName = GameStateKeys<"locks">;
export type PopulationType = GameStateKeys<"populations">;
