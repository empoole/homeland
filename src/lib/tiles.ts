import { baseMapProbabilities, MAP_HEIGHT, MAP_WIDTH } from "../configs/constants";
import type { Tile } from "../types/gameState";

export type TileData = Record<string, Tile>;

const createTile = (
    id: string,
    type: number,
    explored: boolean = false,
): Tile => ({
    id,
    type,
    explored,
});

export const generateTileData = (mapWidth: number, mapHeight: number) => {
    const data = [];
    for (let h = 0; h < mapHeight; h++) {
        const row = [];
        for (let w = 0; w < mapWidth; w++) {
            const tileType = generateTileType();
            const tileId = `${h}-${w}`;
            const tile = createTile(tileId, tileType);
            row.push(tile);
        }
        data.push(row);
    }
    const [startX, startY] = generateStartLocation(MAP_WIDTH, MAP_HEIGHT);
    data[startY][startX].type = 10;
    data[startY][startX].explored = true;

    return data;
};


const generateTileType = () => {
    const randomNum = Math.random();
    let cumulativeProbability = 0;
    const keys = Object.keys(baseMapProbabilities);
    for (let i = 0; i < keys.length; i++) {
        cumulativeProbability += baseMapProbabilities[keys[i] as keyof typeof baseMapProbabilities];
        if (randomNum <= cumulativeProbability) return i;
    }
    return 0;
}

export const generateStartLocation = (mapWidth: number, mapHeight: number) => {
    const startX = Math.trunc(Math.random() * mapWidth);
    const startY = Math.trunc(Math.random() * mapHeight);
    return [startX, startY];
};