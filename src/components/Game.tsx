import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../store";
import timing from "../configs/timing";
import Button from "./ui/Button";
import ResourceDisplay from "./ui/ResourceDisplay";

// import { initializeMapGrid } from "./map/mapGenerator";
// import { MapState } from "../types/map";

import {
  addResource,
  build,
  updatePopulation,
  unlock,
} from "../slices/GameState";
import useFrameTimeInterval from "../hooks/useFrameTimeInterval";
import MapCanvas from "./map/MapCanvas";

const Game = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.gameState);
  const locks = gameState.locks;
  const pops = gameState.populations;

  /// MAP STUFF V

  // const INITIAL_MAP_SIZE = 5;

  // export const initialMapState: MapState = {
  //   mapSize: INITIAL_MAP_SIZE,
  //   grid: initializeMapGrid(INITIAL_MAP_SIZE),
  //   lastVisitedTileId: "0-0", // The starting tile
  // };

  // You would then call your update function to mark its neighbors as 'next-to-visit'
  // e.g., generateNextTiles(initialMapState.grid, '0-0')
  /// MAP STUFF

  useFrameTimeInterval(1000, () => {
    dispatch(updatePopulation());
  });

  useFrameTimeInterval(100, () => {
    const totalPops = Object.values(pops).reduce(
      (total, pop) => total + pop,
      0
    );

    if (totalPops > 50 && locks.tenements) dispatch(unlock("tenements"));
  });

  return (
    <div id="main">
      <section>
        <div id="resource-displays">
          <ResourceDisplay resourceName="resources" />
          <ResourceDisplay resourceName="buildings" />
          <ResourceDisplay resourceName="populations" />
        </div>
        <h4>
          Total Population:{" "}
          {Object.values(pops).reduce((total, pop) => total + pop, 0)}/
          {gameState.maxPop}
        </h4>
        <div id="resource-buttons">
          <Button
            text="Gather Wood"
            cooldown={timing.cooldowns.gather.wood}
            func={() => addResource({ resourceName: "wood", value: 2 })}
          />
          {!locks.mines && (
            <Button
              text="Gather Metals"
              cooldown={timing.cooldowns.gather.metals}
              func={() => addResource({ resourceName: "metals", value: 2 })}
            />
          )}
        </div>
        <div id="build-buttons">
          <Button
            text="Build House"
            cooldown={timing.cooldowns.build.house}
            func={() => build("houses")}
          />
          {!locks.tenements && (
            <Button
              text="Build Tenement"
              cooldown={timing.cooldowns.build.tenement}
              func={() => build("tenements")}
            />
          )}
        </div>
      </section>
      <section>
        <MapCanvas />
      </section>
    </div>
  );
};

export default Game;
