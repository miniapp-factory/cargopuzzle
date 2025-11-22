"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Cell = "empty" | "box" | "target" | "box-on-target";

export default function PushBoxes() {
  const gridSize = 5;
  const initialGrid: Cell[][] = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => "empty")
  );

  // Place boxes
  initialGrid[1][1] = "box";
  initialGrid[2][2] = "box";
  initialGrid[3][3] = "box";

  // Place targets
  initialGrid[1][3] = "target";
  initialGrid[2][4] = "target";
  initialGrid[4][1] = "target";

  const [grid, setGrid] = useState<Cell[][]>(initialGrid);

  const moveBox = (x: number, y: number, dx: number, dy: number) => {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) return;
    if (grid[nx][ny] === "empty" || grid[nx][ny] === "target") {
      const newGrid = grid.map(row => row.slice());
      newGrid[nx][ny] = grid[x][y] === "box" ? "box" : "box-on-target";
      newGrid[x][y] = grid[x][y] === "box-on-target" ? "target" : "empty";
      setGrid(newGrid);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    const dir: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    const [dx, dy] = dir[e.key] ?? [0, 0];
    if (dx === 0 && dy === 0) return;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === "box" || grid[i][j] === "box-on-target") {
          moveBox(i, j, dx, dy);
          return;
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [grid]);

  const reset = () => setGrid(initialGrid);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="grid grid-cols-5 gap-1"
        style={{ width: "200px", height: "200px" }}
      >
        {grid.flatMap((row, i) =>
          row.map((cell, j) => {
            let bg = "bg-background";
            if (cell === "box") bg = "bg-primary";
            if (cell === "target") bg = "bg-secondary";
            if (cell === "box-on-target") bg = "bg-primary/70";
            return (
              <div
                key={`${i}-${j}`}
                className={`${bg} h-12 w-12 flex items-center justify-center border`}
              >
                {cell === "box" && <span>📦</span>}
                {cell === "target" && <span>🎯</span>}
                {cell === "box-on-target" && <span>📦🎯</span>}
              </div>
            );
          })
        )}
      </div>
      <Button onClick={reset}>Reset</Button>
    </div>
  );
}
