import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useFrameTimeInterval from "../../hooks/useFrameTimeInterval";
import { exploreTile } from "../../slices/GameState";
import { TILE_SIZE, MAP_HEIGHT, MAP_WIDTH, TileTypes } from "../../configs/constants";
import type { RootState } from "../../store";
import type { Tile } from "../../types/gameState";
import MapTooltip from "./MapTooltip";

/**
 *
 * The concept for the map is you spend resources to unlock new tiles
 * tiles may contain new resources
 * you can only build so many buildings per tile unlocked
 * far off tiles are more expensive
 *
 * you can "prestige" to unlock a larger map (more tiles more zoomed out)
 *
 */

const MapCanvas = () => {
	const dispatch = useDispatch();

	// 8 is the unexplored tile type (for now)
	const UNEXPLORED_TILE_TYPE = TileTypes.indexOf("unexplored");

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const CANVAS_WIDTH = 320;
	const CANVAS_HEIGHT = 320;
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipText, setTooltipText] = useState("");

	interface Tilemap {
		width: number; // Map width in tiles
		height: number; // Map height in tiles
		tileSize: number; // Size of each tile in pixels
		tiles: Tile[][]; // 2D array representing the map, storing tile IDs
	}

	const tilesState = useSelector((state: RootState) => state.gameState).map
		.tiles;
	const currentResources = useSelector((state: RootState) => state.gameState.resources);

	const tilemapData: Tilemap = {
		width: MAP_WIDTH,
		height: MAP_HEIGHT,
		tileSize: TILE_SIZE,
		tiles: tilesState,
	};

	const tilesetImage = new Image();
	tilesetImage.src = "/tileset.png";

	tilesetImage.onerror = () => {
		console.error("Failed to load tileset image.");
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = initCanvas(canvas);
		if (!context) return;
		setCtx(context);
	}, []);

	const drawMap = (
		ctx: CanvasRenderingContext2D | null,
		map: Tilemap,
		tileset: HTMLImageElement
	) => {
		if (!ctx) return;

		for (let y = 0; y < map.height; y++) {
			for (let x = 0; x < map.width; x++) {
				const tile = map.tiles[y][x];

				const tileType = tile.explored ? tile.type : UNEXPLORED_TILE_TYPE;
				const sourceX =
					(tileType % (tileset.width / map.tileSize)) * map.tileSize;
				const sourceY =
					Math.floor(tileType / (tileset.width / map.tileSize)) *
					map.tileSize;

				ctx.drawImage(
					tileset,
					sourceX,
					sourceY,
					map.tileSize,
					map.tileSize,
					x * map.tileSize,
					y * map.tileSize,
					map.tileSize,
					map.tileSize
				);
			}
		}
	};

	const initCanvas = (canvas: HTMLCanvasElement | null) => {
		if (!canvas) {
			console.error("Canvas not defined");
			return;
		}

		const ctx = canvas.getContext("2d");
		if (!ctx) {
			console.error("Unable to create context");
			return;
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		return ctx;
	};

	const handleCanvasMouseMove = (
		event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
	) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;

		const gridX = Math.floor(mouseX / TILE_SIZE);
		const gridY = Math.floor(mouseY / TILE_SIZE);

		if (
			gridX >= 0 &&
			gridX < MAP_WIDTH &&
			gridY >= 0 &&
			gridY < MAP_HEIGHT
		) {
			const tile =tilesState[gridY][gridX];
			// Show tooltip with tile information
			setTooltipPosition({ 
				x: event.clientX + 10, // Offset slightly from cursor
				y: event.clientY - 30 
			});

			if (!tile.explored) {
				setTooltipText(`Unexplored tile - Click to explore for: ${JSON.stringify(tile.cost)}`);
			} else {
				switch(tile.type) {
					case 0: // empty
						setTooltipText(`Empty tile (${gridX}, ${gridY}) - Can be used for buildings`);
						break;
					case 1: // forest
						setTooltipText(`Forest tile (${gridX}, ${gridY}) - Contributes to food and wood supplies`);
						break;
					case 2: // water
						setTooltipText(`Water tile (${gridX}, ${gridY}) - Contributes to food supply`);
						break;
					case 3: // mine
						setTooltipText(`Mine tile (${gridX}, ${gridY}) - Can be used for metal gathering`);
						break;
					default:
						break;
				}
			}
			setTooltipVisible(true);
		} else {
			setTooltipVisible(false)
		}
	};

	const handleCanvasClick = (
		event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
	) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const clickX = event.clientX - rect.left;
		const clickY = event.clientY - rect.top;

		const gridX = Math.floor(clickX / TILE_SIZE);
		const gridY = Math.floor(clickY / TILE_SIZE);

		if (
			gridX >= 0 &&
			gridX < MAP_WIDTH &&
			gridY >= 0 &&
			gridY < MAP_HEIGHT
		) {
			const tile = tilesState[gridY][gridX];

            setTooltipPosition({ 
                x: clickX + rect.left, 
                y: clickY + rect.top 
            });

			if (!tile.explored) {
				
				const canAfford = tile.cost.food <= currentResources.food && 
								 tile.cost.wood <= currentResources.wood && 
								 tile.cost.metals <= currentResources.metals;

				if (!canAfford) {
					console.log("Not enough resources");
				} else {
					// draw loading tile (type 9)
					setTimeout(() => {
						dispatch(exploreTile({ tileY: gridY, tileX: gridX, tileCost: tile.cost }));
					}, 1000);
				}
			} else {
				switch(tile.type) {
					case 0: // empty
						/**
						 * TODO:
						 * An empty tile can be designated for farming, housing, or industry.
						 * Once designated you will need to invest resources to build.
						 * Each tile can only contain a limited count of buildings.
						 * Buildings can be upgraded at increasing cost.
						 * Tiles can be redesignated (destroys all existing buildings on the tile)
						 */
						break;
					case 1: // forest
						/**
						 * TODO:
						 * A forest tile can be left as is and will produce a small amount of food and wood
						 * A forest can be designated for logging operations to produce more wood but no food
						 * A forest can be cleared which creates an empty tile in its place and grants a lump sum of wood
						 *  - Clearing forests has an environmental impact
						 */
						break;
					case 2: // water
						/**
						 * TODO:
						 * A water tile will generate a small amount of food
						 * 	- One result of environmental instability is a reduction in food production from water tiles
						 * 	- In time the water may dry up turning the tile to a desert (empty tile)
						 *  - Water tiles can also be cleared to create an empty tile
						 * 	- Clearing water tiles has an environmental impact
						 */
						break;
					case 3: // mine
						/**
						 * TODO:
						 * A mine tile can be designated for mining operations to produce metals
						 * An undesignated mine does not generate metals
						 * A mine must be built on before it starts generating metals
						 */
						break;
					default:
						break;
				}
			}
            
            setTooltipVisible(true);
		}
	};

    const handleTooltipToggle = () => {
        setTooltipVisible(!tooltipVisible);
    };

    const handleCanvasMouseLeave = () => {
        setTooltipVisible(false);
    };

	useFrameTimeInterval(100, () => drawMap(ctx, tilemapData, tilesetImage));

	return (
		<>
			<canvas
				ref={canvasRef}
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
				style={{ border: "2px solid #b8c2b9" }}
				onClick={handleCanvasClick}
				onMouseMove={handleCanvasMouseMove}
				onMouseLeave={handleCanvasMouseLeave}
			></canvas>
			<MapTooltip 
				x={tooltipPosition.x} 
                y={tooltipPosition.y} 
                text={tooltipText}
                isVisible={tooltipVisible} 
                onToggle={handleTooltipToggle}
			/>
		</>
		
	);
};

export default MapCanvas;
