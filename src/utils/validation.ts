import type { Grid, GridSize } from '../types/game';

export function isValidMove(
  grid: Grid,
  row: number,
  col: number,
  num: number,
  size: GridSize
): boolean {
  const subRows = size === 4 ? 2 : 2;
  const subCols = size === 4 ? 2 : 3;

  // Check row
  for (let x = 0; x < size; x++) {
    if (x !== col && grid[row][x].value === num) return false;
  }

  // Check column
  for (let x = 0; x < size; x++) {
    if (x !== row && grid[x][col].value === num) return false;
  }

  // Check sub-grid
  const startRow = row - (row % subRows);
  const startCol = col - (col % subCols);
  for (let i = 0; i < subRows; i++) {
    for (let j = 0; j < subCols; j++) {
      const currentRow = startRow + i;
      const currentCol = startCol + j;
      if (
        (currentRow !== row || currentCol !== col) &&
        grid[currentRow][currentCol].value === num
      ) {
        return false;
      }
    }
  }

  return true;
}

export function checkSolution(currentGrid: Grid, solution: Grid): boolean {
  for (let i = 0; i < currentGrid.length; i++) {
    for (let j = 0; j < currentGrid[i].length; j++) {
      if (currentGrid[i][j].value !== solution[i][j].value) {
        return false;
      }
    }
  }
  return true;
}
