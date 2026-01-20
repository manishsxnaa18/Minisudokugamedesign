import type { Grid } from '../types/game';

export function getHint(
  currentGrid: Grid,
  solution: Grid
): { row: number; col: number; value: number } | null {
  const emptyCells: { row: number; col: number; value: number }[] = [];

  for (let i = 0; i < currentGrid.length; i++) {
    for (let j = 0; j < currentGrid[i].length; j++) {
      if (currentGrid[i][j].value === 0) {
        emptyCells.push({
          row: i,
          col: j,
          value: solution[i][j].value,
        });
      }
    }
  }

  if (emptyCells.length === 0) return null;

  // Return a random empty cell with its solution
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
}
