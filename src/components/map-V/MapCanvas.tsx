import React, { useRef, useEffect, useCallback } from "react";
import type { Coordinate, MapState } from "../../types/map-V"; // Assume these types are defined

type MapCanvasProps = {
  mapState: MapState;
  onTileClick: (coord: Coordinate) => void;
  // Other props like resource cost and display settings
};

const TILE_SIZE = 32; // Pixels per tile
const MAP_PADDING = 50; // Padding for the view to center the map

const MapCanvas: React.FC<MapCanvasProps> = ({ mapState, onTileClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Rendering Logic ---
  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Calculate the center offset for rendering
    const canvasSize = mapState.mapSize * TILE_SIZE;
    const offsetX = canvas.width / 2 - canvasSize / 2;
    const offsetY = canvas.height / 2 - canvasSize / 2;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Iterate and Draw Tiles
    mapState.grid.forEach((tile) => {
      const { x, y, type, status } = tile;

      // Map grid coordinate (e.g., -2 to 2) to canvas pixel coordinate
      const pixelX =
        offsetX + (x + Math.floor(mapState.mapSize / 2)) * TILE_SIZE;
      const pixelY =
        offsetY + (y + Math.floor(mapState.mapSize / 2)) * TILE_SIZE;

      // a. Determine Fill Color based on status and type
      let color = "#ccc"; // Default for unexplored
      if (status === "next-to-visit") {
        color = "#aaffaa"; // Light green for explorable
      } else if (status === "visited") {
        color = type === "water" ? "#6699ff" : "#00cc00"; // Blue for water, dark green for visited grass
      }

      // b. Draw the tile
      ctx.fillStyle = color;
      ctx.fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);

      // c. Draw a border
      ctx.strokeStyle = "#333";
      ctx.strokeRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);
    });
  }, [mapState]);

  // Redraw map whenever mapState changes
  useEffect(() => {
    drawMap();
  }, [mapState, drawMap]);

  // --- Click/Interaction Logic ---
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Get click position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // 2. Reverse Calculation (Pixel to Grid Coordinate)
    const mapSize = mapState.mapSize;
    const canvasSize = mapSize * TILE_SIZE;
    const offsetX = canvas.width / 2 - canvasSize / 2;
    const offsetY = canvas.height / 2 - canvasSize / 2;

    // Calculate grid index (0 to mapSize-1)
    const gridIndexX = Math.floor((clickX - offsetX) / TILE_SIZE);
    const gridIndexY = Math.floor((clickY - offsetY) / TILE_SIZE);

    // Calculate actual map coordinate (e.g., -2 to 2 for a 5x5 map)
    const coordX = gridIndexX - Math.floor(mapSize / 2);
    const coordY = gridIndexY - Math.floor(mapSize / 2);

    // 3. Check if the coordinate is valid and call handler
    // Only process if click is within the map boundaries
    if (
      gridIndexX >= 0 &&
      gridIndexX < mapSize &&
      gridIndexY >= 0 &&
      gridIndexY < mapSize
    ) {
      onTileClick({ x: coordX, y: coordY });
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={mapState.mapSize * TILE_SIZE + MAP_PADDING}
      height={mapState.mapSize * TILE_SIZE + MAP_PADDING}
      onClick={handleCanvasClick}
      style={{ border: "1px solid black", backgroundColor: "#eee" }}
    />
  );
};

export default MapCanvas;
