import { createAction } from "@reduxjs/toolkit";

export const build = createAction("GameState/Build", (building: string) => ({
  payload: { building },
}));
