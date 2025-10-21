import {
	baseMapProbabilities,
	MAP_HEIGHT,
	MAP_WIDTH,
} from "../configs/constants";
import type { Tile, TileCost } from "../types/gameState";

export type TileData = Record<string, Tile>;

const createTile = (
	id: string,
	type: number,
	cost: TileCost,
	explored: boolean = false
): Tile => ({
	id,
	type,
	cost,
	explored,
});

export const generateTileData = (mapWidth: number, mapHeight: number) => {
	const [startX, startY] = generateStartLocation(MAP_WIDTH, MAP_HEIGHT);
	const data = [];
	for (let h = 0; h < mapHeight; h++) {
		const row = [];
		for (let w = 0; w < mapWidth; w++) {
			const tileType = generateTileType();
			const tileId = `${h}-${w}`;

			const distanceFromHome = Math.abs(h - startY) + Math.abs(w - startX);
			const foodCost = 1 + distanceFromHome * 0.5;
			const woodCost = distanceFromHome <= 5 ? 0 : 1 + distanceFromHome * 0.25;
			const metalCost = distanceFromHome <= 10 ? 0 : 1 + distanceFromHome * 0.1;
			const tileCost = {
				food: foodCost,
				wood: woodCost,
				metals: metalCost
			}
			const tile = createTile(tileId, tileType, tileCost);
			row.push(tile);
		}
		data.push(row);
	}
	
	data[startY][startX].type = 10;
	data[startY][startX].explored = true;

	return data;
};

const generateTileType = () => {
	const randomNum = Math.random();
	let cumulativeProbability = 0;
	const keys = Object.keys(baseMapProbabilities);
	for (let i = 0; i < keys.length; i++) {
		cumulativeProbability +=
			baseMapProbabilities[keys[i] as keyof typeof baseMapProbabilities];
		if (randomNum <= cumulativeProbability) return i;
	}
	return 0;
};

export const generateStartLocation = (mapWidth: number, mapHeight: number) => {
	const startX = Math.trunc(Math.random() * mapWidth);
	const startY = Math.trunc(Math.random() * mapHeight);
	return [startX, startY];
};
