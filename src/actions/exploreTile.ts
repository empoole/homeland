import { createAction } from "@reduxjs/toolkit";
import type { TileCost } from "../types/gameState";

export const exploreTile = createAction(
	"GameState/ExploreTile",
	({ tileY, tileX, tileCost }: { tileY: number; tileX: number, tileCost: TileCost }) => ({
		payload: { tileY, tileX, tileCost },
	})
);
