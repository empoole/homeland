import { createAction } from "@reduxjs/toolkit";

export const unlock = createAction("GameState/Unlock", (type: string) => ({
  payload: { type },
}));
