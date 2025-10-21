export type GameState = {
	map: {
		totalExploredTiles: number;
		tiles: Tile[][];
		probabilities: { [key: string]: number };
	};
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
	};
};

export const TilesTypeNames = [
	"unexplored",
	"highlighted",
	"home",
	"empty",
	"mines",
	"houses",
	"farms",
];
export type TileResource = "wood" | "food" | "metals"
export type TileCost = Record<TileResource, number>
export type Tile = {
	id: string;
	type: number;
	cost: TileCost;
	explored: boolean;
};

export type GameStateKeys<T extends keyof GameState> = keyof GameState[T];

export type ResourceName = GameStateKeys<"resources">;
export type BuildingName = GameStateKeys<"buildings">;
export type LockName = GameStateKeys<"locks">;
export type PopulationType = GameStateKeys<"populations">;
