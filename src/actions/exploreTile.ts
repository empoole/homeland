import { createAction } from "@reduxjs/toolkit";

export const exploreTile = createAction("GameState/ExploreTile", (
  {tileY, tileX}:
  {tileY: number, tileX: number}
) => ({
  payload: { tileY, tileX }
}));
