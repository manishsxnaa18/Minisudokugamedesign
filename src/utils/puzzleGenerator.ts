import type { Grid, GridSize, Difficulty } from '../types/game';

// Generate a complete valid Sudoku solution
function generateSolution(size: GridSize): number[][] {
  const grid: number[][] = Array(size)
    .fill(0)
    .map(() => Array(size).fill(0));

  const subRows = size === 4 ? 2 : 2;
  const subCols = size === 4 ? 2 : 3;

  function isValid(grid: number[][], row: number, col: number, num: number): boolean {
    // Check row
    for (let x = 0; x < size; x++) {
      if (grid[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < size; x++) {
      if (grid[x][col] === num) return false;
    }

    // Check sub-grid
    const startRow = row - (row % subRows);
    const startCol = col - (col % subCols);
    for (let i = 0; i < subRows; i++) {
      for (let j = 0; j < subCols; j++) {
        if (grid[startRow + i][startCol + j] === num) return false;
      }
    }

    return true;
  }

  function solve(grid: number[][]): boolean {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col] === 0) {
          const numbers = Array.from({ length: size }, (_, i) => i + 1);
          // Shuffle for randomness
          for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
          }

          for (const num of numbers) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (solve(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve(grid);
  return grid;
}

// Remove numbers from solution to create puzzle
function createPuzzle(solution: number[][], size: GridSize, difficulty: Difficulty): number[][] {
  const puzzle = solution.map((row) => [...row]);

  // Determine number of clues based on difficulty
  let targetClues: number;
  if (size === 4) {
    switch (difficulty) {
      case 'easy':
        targetClues = 9;
        break;
      case 'moderate':
        targetClues = 7;
        break;
      case 'hard':
        targetClues = 5;
        break;
    }
  } else {
    // 6x6
    switch (difficulty) {
      case 'easy':
        targetClues = 20;
        break;
      case 'moderate':
        targetClues = 14;
        break;
      case 'hard':
        targetClues = 10;
        break;
    }
  }

  const cellsToRemove = size * size - targetClues;
  const positions: [number, number][] = [];
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      positions.push([i, j]);
    }
  }

  // Shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // Remove numbers
  for (let i = 0; i < cellsToRemove && i < positions.length; i++) {
    const [row, col] = positions[i];
    puzzle[row][col] = 0;
  }

  return puzzle;
}

// Convert number grid to Cell grid
function toGrid(numbers: number[][], isInitial: boolean = false): Grid {
  return numbers.map((row) =>
    row.map((value) => ({
      value,
      isInitial: isInitial && value !== 0,
      notes: new Set<number>(),
    }))
  );
}

export function generatePuzzle(
  size: GridSize,
  difficulty: Difficulty
): { initialGrid: Grid; solution: Grid } {
  const solutionNumbers = generateSolution(size);
  const puzzleNumbers = createPuzzle(solutionNumbers, size, difficulty);

  return {
    initialGrid: toGrid(puzzleNumbers, true),
    solution: toGrid(solutionNumbers),
  };
}
