import { populationLimitIncreasesByBuilding } from "../../../configs/constants";
import type { GameState } from "../../../types/gameState";
import type { BuildingName } from "../../../types/gameState";

export const buildingMutations = {
  addBuilding: (state: GameState, building: BuildingName, quantity: number) => {
    return {
      ...state,
      buildings: {
        ...state.buildings,
        [building]: (state.buildings[building] || 0) + quantity
      }
    };
  },

  increasePopulationLimit: (state: GameState, increase: number) => {
    return {
      ...state,
      populationMeta: {
        ...state.populationMeta,
        maxPop: state.populationMeta.maxPop + increase
      }
    };
  },

  buildHousing: (state: GameState, building: BuildingName, quantity: number) => {
    const popIncrease = (populationLimitIncreasesByBuilding[
      building as keyof typeof populationLimitIncreasesByBuilding
    ] || 0) * quantity;
    let newState = buildingMutations.addBuilding(state, building, quantity);
    if (popIncrease > 0) {
      newState = buildingMutations.increasePopulationLimit(newState, popIncrease);
    }
      
    return newState;
  }
};