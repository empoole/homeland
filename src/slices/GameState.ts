import { createSlice } from "@reduxjs/toolkit";
import costs from "../configs/costs";
import type { ResourceName, BuildingName, LockName } from "../types/gameState";
import { baseMultipliers } from "../types/gameState";
import type { GameState } from "../types/gameState";

export const mapBuildingToResource = {
  home: ["food", "wood"],
  farms: ["food"],
  mines: ["metals"],
} as const;

export const mapResourceToBuilding = {
  wood: ["home"],
  food: ["home", "farms"],
  metals: ["mines"],
} as const;


// NOTES:
// to build a mine you need to find a mine tile and build a mine there
//

const initialState: GameState = {
  map: {
    totalExploredTiles: 1,
    tiles: [],  
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
    maxRandomGrowth: 3
  },
  locks: {
    mines: true,
    tenements: true,
    factories: true,
    metals: true,
  },
  multipliers: baseMultipliers
};

export const gameStateSlice = createSlice({
  name: "GameState",
  initialState,
  reducers: {
    addResource: (state, action) => {
      const resourceName: string = action.payload.resourceName;
      state.resources[resourceName as ResourceName] += action.payload.value;
    },
    unlock: (state, action) => {
      const unlockType = action.payload.type as LockName;
      state.locks[unlockType] = true;
    },
    build: (state, action) => {
      const building: BuildingName = action.payload;
      const cost = costs.buildings[building as keyof typeof costs.buildings];
      if (!cost) {
        console.warn(`Attempted to build unknown building: ${building}`);
        return state;
      }

      const newResources = { ...state.resources };
      const newBuildings = { ...state.buildings };
      const maxPop = state.populationMeta.maxPop;
      let canAfford = true;

      const updatedResources: { wood: number; food: number; metals: number } = {
        wood: 0,
        food: 0,
        metals: 0,
      };

      Object.keys(cost).forEach((resourceKey) => {
        const resourceName = resourceKey as ResourceName;
        const resourceCost = cost[resourceKey as keyof typeof cost] || 0;
        const currentValue = newResources[resourceName];

        if (currentValue < resourceCost) {
          canAfford = false;
          console.log(`Insufficient ${resourceName} to build ${building}.`);
        } else {
          updatedResources[resourceName] = currentValue - resourceCost;
        }
      });

      if (!canAfford) return state;

      Object.assign(newResources, updatedResources);
      newBuildings[building] = (newBuildings[building] || 0) + 1;

      return {
        ...state,
        populationMeta: { ...state.populationMeta, maxPop: maxPop + 5},
        resources: newResources,
        buildings: newBuildings,
      };
    },
    exploreTile: (state, action) => {
      const tileId = action.payload;
      const tile = state.map.tiles[tileId]
      tile.explored = true;
      return {
        ...state,
        map: {
          ...state.map,
          totalExploredTiles: state.map.totalExploredTiles + 1,
          tiles: [ ...state.map.tiles, tile ]
        },
      }
    },
    incrementResources: (state) => {
      const resources = {...state.resources};
      const buildings = {...state.buildings};
      
      for (const building in buildings) {
        const resourceTypes = mapBuildingToResource[building as keyof typeof mapBuildingToResource]
        if (!resourceTypes) {
          console.warn(`No resources mapped for building: ${building}`);
          continue;
        }
        const numGenerators = buildings[building as keyof typeof buildings]
        const multiplier = state.multipliers[building as keyof typeof state.multipliers];
        if (!multiplier) {
            console.warn(`No multiplier found for resource: ${building}`);
            continue;
        }
        const increment = multiplier * numGenerators;
        for (const resource of resourceTypes) {
          resources[resource as ResourceName] = resources[resource as ResourceName] + increment;
        }
      }
      
      return { ...state, resources: resources }
    },
    updatePopulation: (state) => {
      if (Math.random() > state.populationMeta.civilianGrowthProbability) return;

      const totalPop = Object.values(state.populations).reduce(
        (total, pop) => total + pop,
        0
      );

      if (totalPop >= state.populationMeta.maxPop) return;

      const availableCapacity = state.populationMeta.maxPop - totalPop;
      const randomGrowth = Math.random() * state.populationMeta.maxRandomGrowth;
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
  updatePopulation,
  exploreTile,
  incrementResources,
  unlock
} = gameStateSlice.actions;

export default gameStateSlice.reducer;
