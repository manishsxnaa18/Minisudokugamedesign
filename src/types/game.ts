export type GridSize = 4 | 6;
export type Difficulty = 'easy' | 'moderate' | 'hard';

export interface Cell {
  value: number;
  isInitial: boolean;
  isError?: boolean;
  notes?: Set<number>;
}

export type Grid = Cell[][];

export interface GameConfig {
  gridSize: GridSize;
  difficulty: Difficulty;
  initialGrid: Grid;
  solution: Grid;
  autoCheck: boolean;
}

export interface GameState {
  currentGrid: Grid;
  isComplete: boolean;
  elapsedTime: number;
  hintsUsed: number;
  mistakes: number;
}
