import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../store";
import timing from "../configs/timing";
import Button from "./ui/Button";
import ResourceDisplay from "./ui/ResourceDisplay";

import {
  addResource,
  build,
  updatePopulation,
  unlock,
} from "../slices/GameState";
import useFrameTimeInterval from "../hooks/useFrameTimeInterval";

const Game = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.gameState);
  const locks = gameState.locks;
  const pops = gameState.populations;

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
    <section>
      <ResourceDisplay resourceName="resources" />
      <ResourceDisplay resourceName="buildings" />
      <ResourceDisplay resourceName="populations" />
      <h4>
        Total Population:{" "}
        {Object.values(pops).reduce((total, pop) => total + pop, 0)}/
        {gameState.maxPop}
      </h4>
      <ul>
        <li>
          <Button
            text="Gather Wood"
            cooldown={timing.cooldowns.gather.wood}
            func={() => addResource({ resourceName: "wood", value: 2 })}
          />
        </li>
        {!locks.mines && (
          <li>
            <Button
              text="Gather Metals"
              cooldown={timing.cooldowns.gather.metals}
              func={() => addResource({ resourceName: "metals", value: 2 })}
            />
          </li>
        )}
      </ul>
      <ul>
        <li>
          <Button
            text="Build House"
            cooldown={timing.cooldowns.build.house}
            func={() => build("houses")}
          />
        </li>
        {!locks.tenements && (
          <li>
            <Button
              text="Build Tenement"
              cooldown={timing.cooldowns.build.tenement}
              func={() => build("tenements")}
            />
          </li>
        )}
      </ul>
    </section>
  );
};

export default Game;
