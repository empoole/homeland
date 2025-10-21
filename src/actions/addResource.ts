import { createAction } from "@reduxjs/toolkit";

export const addResource = createAction(
	"GameState/AddResource",
	(resourceName: string, value: number) => ({
		payload: { resourceName, value },
	})
);
