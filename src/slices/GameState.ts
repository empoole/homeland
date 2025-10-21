import { createSlice } from "@reduxjs/toolkit";
import {
	baseMapProbabilities,
	baseBuildingMultipliers,
} from "../configs/constants";
import { generateTileData } from "../lib/tiles";
import { MAP_HEIGHT, MAP_WIDTH } from "../configs/constants";
import { buildingMutations } from "../lib/state/mutations/buildings";
import { calculateResourceIncrement } from "../lib/state/helpers/helpers"

import costs from "../configs/costs";

import type { ResourceName, LockName, BuildingName } from "../types/gameState";
import type { GameState } from "../types/gameState";
import { TileTypes } from "../configs/constants";

const tiles = generateTileData(MAP_WIDTH, MAP_HEIGHT);
const initialState: GameState = {
  environment: {
    stability: 100,
  },
	map: {
		totalExploredTiles: 1,
		tiles: tiles,
		probabilities: baseMapProbabilities,
	},
	resources: {
		wood: 1000,
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
				resources[resourceName] = currentValue - resourceCost;
			});

			switch (entityType) {
				case "buildings":
          if(entityName === "houses" || entityName === "tenements") {
            const newState = buildingMutations.buildHousing(state, entityName as BuildingName, quantity)
            return {...newState, resources: {...resources}}
          }
          if (entityName === "mines" || entityName === "farms" || entityName === "factories") {
            const newState = buildingMutations.addBuilding(state, entityName as BuildingName, quantity)
            return {...newState, resources: {...resources}}
          }
					break;
				default:
					break;
			}

			return {
				...state,
				resources: { ...resources },
			};
		},
		exploreTile: (state, action) => {
			const { tileY, tileX } = action.payload;
      const tileCost = action.payload.tileCost as Record<ResourceName, number>;
      const resources = {...state.resources};
			for (const resource in tileCost) {
				const cost = tileCost[resource as ResourceName];
				const remainingResources =
					resources[resource as ResourceName] - cost;
				if (remainingResources < 0) {
					console.log(`Insufficient ${resource} to explore this tile.`);
					return state;
				}
				resources[resource as ResourceName] = remainingResources;
			}

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
        resources: {...resources},
				map: {
					...state.map,
					totalExploredTiles: state.map.totalExploredTiles + 1,
					tiles: updatedTiles,
				},
			};
		},
		incrementResources: (state) => {
      // Main logic
      const resourceIncrements: Array<{ resource: ResourceName; increment: number }> = [
        // From tiles
        ...state.map.tiles
          .flat()
          .filter(tile => tile.explored)
          .flatMap(tile => calculateResourceIncrement(TileTypes[tile.type], 1, state.multipliers, state.populations.civilians)),
        
        // From buildings
        ...Object.entries(state.buildings)
          .flatMap(([building, quantity]) => 
            calculateResourceIncrement(building, quantity, state.multipliers, state.populations.civilians)
          )
      ];

      // Apply all increments
      const updatedResources = { ...state.resources };
      for (const { resource, increment } of resourceIncrements) {
        updatedResources[resource] += increment;
      }

      return { ...state, resources: updatedResources };
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
	purchase,
	updatePopulation,
	exploreTile,
	incrementResources,
	unlock,
} = gameStateSlice.actions;

export default gameStateSlice.reducer;
