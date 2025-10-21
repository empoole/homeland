import { createSlice } from "@reduxjs/toolkit";
import {
	baseMapProbabilities,
	baseBuildingMultipliers,
	mapBuildingToResource,
} from "../configs/constants";
import { generateTileData } from "../lib/tiles";
import { MAP_HEIGHT, MAP_WIDTH } from "../configs/constants";

import costs from "../configs/costs";

import type { ResourceName, BuildingName, LockName } from "../types/gameState";
import type { GameState } from "../types/gameState";

// NOTES:
// to build a mine you need to find a mine tile and build a mine there
//
const tiles = generateTileData(MAP_WIDTH, MAP_HEIGHT);
const initialState: GameState = {
	map: {
		totalExploredTiles: 1,
		tiles: tiles,
		probabilities: baseMapProbabilities,
	},
	resources: {
		wood: 0,
		food: 0,
		metals: 0,
	},
	buildings: {
		home: 1,
		houses: 0,
		tenements: 0,
		farms: 0,
		mines: 0,
		factories: 0,
	},
	populations: {
		civilians: 0,
	},
	populationMeta: {
		// These values could be a function of total food, availible jobs, housing, policies etc
		maxPop: 5,
		civilianGrowthProbability: 0.12,
		maxRandomGrowth: 3,
	},
	locks: {
		mines: true,
		tenements: true,
		factories: true,
		metals: true,
	},
	multipliers: baseBuildingMultipliers,
};

export const gameStateSlice = createSlice({
	name: "GameState",
	initialState,
	reducers: {
		addResource: (state, action) => {
			const resourceName: string = action.payload.resourceName;
			state.resources[resourceName as ResourceName] +=
				action.payload.value;
		},
		unlock: (state, action) => {
			const unlockType = action.payload.type as LockName;
			state.locks[unlockType] = true;
		},
		purchase: (state, action) => {
			const entityType: string = action.payload.entityType;
			const entityName: string = action.payload.entityName;
			const quantity: number = action.payload.quantity;
			const resources = { ...state.resources };
			const cost = costs[entityType as keyof typeof costs];
			if (!cost) {
				console.warn(
					`Attempted to purchase unknown entity type: ${entityType}`
				);
				return state;
			}
			const entityCost = cost[entityName as keyof typeof cost];
			if (!entityCost) {
				console.warn(
					`Attempted to purchase unknown entity: ${entityName}`
				);
				return state;
			}

			const updatedResources: {
				wood: number;
				food: number;
				metals: number;
			} = {
				wood: 0,
				food: 0,
				metals: 0,
			};

			Object.keys(entityCost).forEach((resourceKey) => {
				const resourceName = resourceKey as ResourceName;
				const resourceCost =
					(entityCost[resourceKey as keyof typeof entityCost] || 0) *
					quantity;
				const currentValue = resources[resourceName];
				if (currentValue < resourceCost) {
					console.log(
						`Insufficient ${resourceName} to purchase ${entityName}.`
					);
					return state;
				}
				updatedResources[resourceName] = currentValue - resourceCost;
			});

			Object.assign(resources, updatedResources);

			// TODO: Refactor this to work with other types better?
			switch (entityType) {
				case "buildings":
					gameStateSlice.caseReducers.build(state, {
						payload: { building: entityName },
						type: action.payload.type,
					});
					break;
				default:
					break;
			}

			return {
				...state,
				resources: { ...resources },
			};
		},
		build: (state, action) => {
			const building: BuildingName = action.payload.building;
			const newBuildings = { ...state.buildings };
			// TODO: right now we're only building houses
			// this should handle all sorts of building effects
			const maxPop = state.populationMeta.maxPop;

			newBuildings[building] = (newBuildings[building] || 0) + 1;

			console.log({ ...newBuildings });

			// TODO: Again the next line is assuming we can only build houses
			return {
				...state,
				buildings: { ...newBuildings },
				populationMeta: { ...state.populationMeta, maxPop: maxPop + 5 },
			};
		},
		exploreTile: (state, action) => {
			const { tileY, tileX } = action.payload;
			const updatedTiles = state.map.tiles.map((row, rowIndex) =>
				rowIndex === tileY
					? row.map((tile, colIndex) =>
							colIndex === tileX
								? { ...tile, explored: true }
								: tile
					  )
					: row
			);

			return {
				...state,
				map: {
					...state.map,
					totalExploredTiles: state.map.totalExploredTiles + 1,
					tiles: updatedTiles,
				},
			};
		},
		incrementResources: (state) => {
			const resources = { ...state.resources };
			const buildings = { ...state.buildings };

			for (const building in buildings) {
				const resourceTypes =
					mapBuildingToResource[
						building as keyof typeof mapBuildingToResource
					];
				if (!resourceTypes) {
					console.warn(
						`No resources mapped for building: ${building}`
					);
					continue;
				}
				const numGenerators =
					buildings[building as keyof typeof buildings];
				const multiplier =
					state.multipliers[
						building as keyof typeof state.multipliers
					];
				if (!multiplier) {
					console.warn(
						`No multiplier found for resource: ${building}`
					);
					continue;
				}
				const increment = multiplier * numGenerators;
				for (const resource of resourceTypes) {
					resources[resource as ResourceName] =
						resources[resource as ResourceName] + increment;
				}
			}

			return { ...state, resources: resources };
		},
		updatePopulation: (state) => {
			if (Math.random() > state.populationMeta.civilianGrowthProbability)
				return;

			const totalPop = Object.values(state.populations).reduce(
				(total, pop) => total + pop,
				0
			);

			if (totalPop >= state.populationMeta.maxPop) return;

			const availableCapacity = state.populationMeta.maxPop - totalPop;
			const randomGrowth =
				Math.random() * state.populationMeta.maxRandomGrowth;
			const newCivsUncapped = Math.min(randomGrowth, availableCapacity);
			const newCivs = Math.trunc(newCivsUncapped);

			if (newCivs > 0) {
				const newPops = {
					...state.populations,
					civilians: state.populations.civilians + newCivs,
				};

				return { ...state, populations: newPops };
			}
		},
	},
});

export const {
	addResource,
	build,
	purchase,
	updatePopulation,
	exploreTile,
	incrementResources,
	unlock,
} = gameStateSlice.actions;

export default gameStateSlice.reducer;
