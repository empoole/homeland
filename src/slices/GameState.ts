import { createSlice } from "@reduxjs/toolkit";
import costs from "../configs/costs";

type Cost = {
  wood: number;
};

type GameState = {
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
};

const initialState = {
  maxPop: 5,
  resources: {
    wood: 0, // building materials
    food: 0,
    metals: 0,
  },
  buildings: {
    houses: 0,
    tenements: 0, // more pops but more migrants
    farms: 0,
    mines: 0,
    factories: 0,
  },
  populations: {
    civilians: 0,
    migrants: 0,
    // migrants become civilians after 2 generations
    // migrants are limited in what they are allowed to do
    // migrants can be allowed to do more by overcoming politcal pressure
    // am I sure I know what my point is here?
  },
};

const purchase = (state: GameState, cost: Partial<Cost>) => {
  Object.keys(cost).forEach((resource) => {
    let currentValue =
      state.resources[resource as keyof GameState["resources"]];
    const resourceCost = cost[resource as keyof Cost] || 0;
    if (currentValue >= resourceCost) currentValue -= resourceCost;
    state.resources[resource as keyof GameState["resources"]] = currentValue;
  });
};

export const gameStateSlice = createSlice({
  name: "GameState",
  initialState,
  reducers: {
    addResource: (state, action) => {
      const resourceName = action.payload.resourceName;
      state.resources[resourceName as keyof GameState["resources"]] +=
        action.payload.value;
    },
    spendWood: (state) => {
      state.resources.wood -= 1;
    },
    spendFood: (state) => {
      state.resources.food -= 1;
    },
    buildHouse: (state) => {
      const cost = costs.buildings.house;
      if (state.resources.wood >= cost.wood) {
        purchase(state, cost);
        state.buildings.houses += 1;
        state.maxPop += 5;
      }
    },
    updatePopulation: (state) => {
      if (Math.random() > 0.08) return; // Often you don't get any new civilians
      const totalPop = Object.values(state.populations).reduce(
        (total, pop) => total + pop,
        0
      );
      if (totalPop < state.maxPop) {
        let newCivs = Math.random() * 3;
        if (totalPop + newCivs > state.maxPop) {
          newCivs = state.maxPop - totalPop;
        }
        state.populations.civilians += Math.floor(newCivs);
      }
    },
  },
});

export const { addResource, buildHouse, updatePopulation } =
  gameStateSlice.actions;

export default gameStateSlice.reducer;
