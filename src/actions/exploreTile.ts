import { createAction } from "@reduxjs/toolkit";

export const build = createAction("GameState/ExploreTile", (tileId: string) => ({
  payload: { tileId },
}));
