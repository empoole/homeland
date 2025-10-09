import { useState, useCallback } from "react";

import MapCanvas from "./MapCanvas";

import type { MapState, ResourceState, Coordinate } from "../../types/map-V";

import { initialMapState } from "./mapGenerator";

const initialResources = {
  food: 10,
};

// Inside your <Map /> component
const Map = () => {
  // Assume you have state management for map and resources
  const [mapState, setMapState] = useState<MapState>(initialMapState);
  const [resources, setResources] = useState<ResourceState>(initialResources);

  const handleTileExplore = useCallback(
    (coord: Coordinate) => {
      const id = `${coord.x}-${coord.y}`;
      const tile = mapState.grid.get(id);

      if (!tile || tile.status !== "next-to-visit") {
        return; // Not a valid tile to explore
      }

      const cost = tile.resourceCost;

      // 1. Check Resources
      if (
        resources.food < (cost.food || 0) // ||
        // resources.stone < (cost.stone || 0)
      ) {
        console.log("Not enough resources!");
        return;
      }

      // 2. Deduct Resources and Update Map
      setResources((prev) => ({
        food: prev.food - (cost.food || 0),
        // stone: prev.stone - (cost.stone || 0),
      }));

      setMapState((prev) => {
        const newGrid = new Map(prev.grid);
        const newTile = { ...tile, status: "visited" as const };
        newGrid.set(id, newTile);

        // 3. Call the logic to reveal neighbors (as discussed in the prior response)
        // You would have a separate function for this:
        // const updatedGrid = generateNextTiles(newGrid, id);

        return {
          ...prev,
          grid: updatedGrid,
          lastVisitedTileId: id,
        };
      });

      // 4. Check for map scale up (if applicable)
      // checkMapScaleUp(mapState.mapSize, mapState.grid);
    },
    [mapState, resources]
  );

  return (
    <div>
      <h1>Exploration Map</h1>
      <MapCanvas mapState={mapState} onTileClick={handleTileExplore} />
      {/* <ResourceDisplay resources={resources} /> */}
    </div>
  );
};

export default Map;
