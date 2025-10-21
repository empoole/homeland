import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useFrameTimeInterval from "../../hooks/useFrameTimeInterval";
import { exploreTile } from "../../slices/GameState";
import { TILE_SIZE, MAP_HEIGHT, MAP_WIDTH } from "../../configs/constants";
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

// 8 is the unexplored tile type (for now)
const UNEXPLORED_TILE_TYPE = 8;

const MapCanvas = () => {
	const dispatch = useDispatch();

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
					case 1: // empty
						setTooltipText(`Empty tile (${gridX}, ${gridY}) - Can be used for buildings`);
						break;
					case 2: // forest
						setTooltipText(`Forest tile (${gridX}, ${gridY}) - Contributes to food and wood supplies`);
						break;
					case 3: // water
						setTooltipText(`Water tile (${gridX}, ${gridY}) - Contributes to food supply`);
						break;
					case 4: // mine
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

            // Show tooltip with tile information
            setTooltipPosition({ 
                x: clickX + rect.left, 
                y: clickY + rect.top 
            });

			if (!tile.explored) {
				
				const canAfford = tile.cost.food <= currentResources.food && 
								 tile.cost.wood <= currentResources.wood && 
								 tile.cost.metals <= currentResources.metals;

				if (!canAfford) {
					setTooltipText(`Insufficient resources to mount this expedition.`);
					setTooltipVisible(true);
				} else {
					// draw loading tile (type 9)
					setTimeout(() => {
						dispatch(exploreTile({ tileY: gridY, tileX: gridX }));
					}, 1000);
				}
			} else {
				switch(tile.type) {
					case 2: // empty
						setTooltipText(`Empty tile (${gridX}, ${gridY}) - Can be used for buildings`);
						break;
					case 3: // forest
						setTooltipText(`Forest tile (${gridX}, ${gridY}) - Can be used for wood gathering`);
						break;
					case 4: // mine
						setTooltipText(`Mine tile (${gridX}, ${gridY}) - Can be used for metal gathering`);
						break;
					default:
						break;
				}
			}
            
            setTooltipVisible(true);

			// Call the map exploration handler
			// onTileClick({ x: gridX, y: gridY });
			// This should actually do the following:
			// check resource levels
			// if you have enough
			// show loading tile (1)
			// grant tile related reward
			// -----
			// mines give you metal generation
			// forests give you wood generation
			// blank spaces can be made into farms for food generation
			// blank spaces can be dedicated to buildings, allowing up to 5 buildings to be added
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
