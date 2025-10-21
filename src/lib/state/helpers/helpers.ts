import { mapBuildingToResource } from "../../../configs/constants";
import type { GameState } from "../../../types/gameState";
import type { ResourceName } from "../../../types/gameState";

export const calculateResourceIncrement = (
    sourceType: string | undefined,
    quantity: number,
    multipliers: GameState["multipliers"],
    population: number
  ): Array<{ resource: ResourceName; increment: number }> => {
    if (!sourceType) return [];
  
    const resourceTypes = mapBuildingToResource[sourceType as keyof typeof mapBuildingToResource];
    const multiplier = multipliers[sourceType as keyof typeof multipliers];
    
    if (!resourceTypes || !multiplier) return [];
  
    const increment = multiplier * quantity * (population % 5);

    return resourceTypes.map(resource => ({
      resource: resource as ResourceName,
      increment
    }));
  };