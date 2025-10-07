import { createSlice } from "@reduxjs/toolkit";
import costs from "../configs/costs";

type Cost = {
    wood: number,
}

type GameState = {
    maxPop: number,
    resources: {
        wood: number,
        food: number
    },
    buildings: {
        houses: number
    },
    populations: {
        civilians: number
    }
}

const initialState = {
    maxPop: 5,
    resources: {
        wood: 0,
        food: 0,
    },
    buildings: {
        houses: 0
    },
    populations: {
        civilians: 0,
    }
}

const purchase = (state: GameState, cost: Partial<Cost>) => {
    Object.keys(cost).forEach((resource) => {
        state.resources[resource as keyof GameState["resources"]] -= cost[resource]
    });
}

export const gameStateSlice = createSlice({
    name: 'GameState',
    initialState,
    reducers: {
        addWood: (state) => {
            state.resources.wood += 1
        },
        spendWood: (state) => {
            state.resources.wood -= 1
        },
        addFood: (state) => {
            state.resources.food += 1
        },
        spendFood: (state) => {
            state.resources.food -= 1
        },
        buildHouse: (state) => {
            const cost = costs.buildings.house
            if(state.resources.wood >= cost.wood) {
                state.resources.wood -= cost.wood
                state.buildings.houses += 1
                state.maxPop += 5
            }
        },
        updatePopulation: (state) => {
            const totalPop = Object.values(state.populations).reduce(
                (total, pop) => total + pop, 0)
            if (totalPop < state.maxPop) {
                let newCivs = Math.random() * 5;
                if (totalPop + newCivs > state.maxPop) {
                    newCivs = state.maxPop - totalPop
                }
                state.populations.civilians += newCivs
            }
        }
    }
});

export const {
    addWood,
    buildHouse,
    updatePopulation
} = gameStateSlice.actions;

export default gameStateSlice.reducer