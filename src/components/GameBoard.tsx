import { useState } from 'react';
import { Lightbulb, Eraser, PencilLine } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { GameConfig, GameState } from '../types/game';
import { checkSolution, isValidMove } from '../utils/validation';
import { getHint } from '../utils/hints';
import { soundManager } from '../utils/sounds';
import { FirecrackerAnimation } from './FirecrackerAnimation';
import { useUser } from '../contexts/UserContext';

interface GameBoardProps {
  config: GameConfig;
  gameState: GameState;
  setGameState: (state: GameState) => void;
}

export function GameBoard({ config, gameState, setGameState }: GameBoardProps) {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [notesMode, setNotesMode] = useState(false);
  const [showFirecracker, setShowFirecracker] = useState(false);
  const { settings } = useUser();

  const gridSize = config.gridSize;
  const subGridRows = gridSize === 4 ? 2 : 2;
  const subGridCols = gridSize === 4 ? 2 : 3;

  const handleCellClick = (row: number, col: number) => {
    if (gameState.currentGrid[row][col].isInitial || gameState.isComplete) return;
    if (settings.buttonSoundEnabled) {
      soundManager.click();
    }
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || gameState.isComplete) return;
    const { row, col } = selectedCell;
    if (gameState.currentGrid[row][col].isInitial) return;

    if (settings.buttonSoundEnabled) {
      soundManager.click();
    }

    const newGrid = gameState.currentGrid.map((r, i) =>
      r.map((cell, j) => {
        if (i === row && j === col) {
          if (notesMode) {
            const newNotes = new Set(cell.notes || []);
            if (newNotes.has(num)) {
              newNotes.delete(num);
            } else {
              newNotes.add(num);
            }
            return { ...cell, notes: newNotes };
          } else {
            const updatedCell = { ...cell, value: num, notes: new Set<number>(), isError: false };
            
            if (config.autoCheck) {
              const isValid = isValidMove(gameState.currentGrid, row, col, num, gridSize);
              updatedCell.isError = !isValid;
              if (!isValid) {
                soundManager.error();
                setGameState({
                  ...gameState,
                  mistakes: gameState.mistakes + 1,
                });
              }
            }
            
            return updatedCell;
          }
        }
        return cell;
      })
    );

    setGameState({
      ...gameState,
      currentGrid: newGrid,
    });

    setTimeout(() => {
      if (checkSolution(newGrid, config.solution)) {
        setGameState({
          ...gameState,
          currentGrid: newGrid,
          isComplete: true,
        });
        
        // Delay sound and animation slightly
        setTimeout(() => {
          soundManager.firecracker();
          setShowFirecracker(true);
          setTimeout(() => setShowFirecracker(false), 3000);
        }, 200);
      }
    }, 100);
  };

  const handleClearCell = () => {
    if (!selectedCell || gameState.isComplete) return;
    const { row, col } = selectedCell;
    if (gameState.currentGrid[row][col].isInitial) return;

    if (settings.buttonSoundEnabled) {
      soundManager.click();
    }

    const newGrid = gameState.currentGrid.map((r, i) =>
      r.map((cell, j) => {
        if (i === row && j === col) {
          return { ...cell, value: 0, isError: false, notes: new Set<number>() };
        }
        return cell;
      })
    );

    setGameState({
      ...gameState,
      currentGrid: newGrid,
    });
  };

  const handleHint = () => {
    if (gameState.isComplete) return;
    
    if (settings.buttonSoundEnabled) {
      soundManager.hint();
    }
    const hint = getHint(gameState.currentGrid, config.solution);
    if (!hint) return;

    const { row, col, value } = hint;
    const newGrid = gameState.currentGrid.map((r, i) =>
      r.map((cell, j) => {
        if (i === row && j === col) {
          return { ...cell, value, isError: false, notes: new Set<number>() };
        }
        return cell;
      })
    );

    setGameState({
      ...gameState,
      currentGrid: newGrid,
      hintsUsed: gameState.hintsUsed + 1,
    });

    setTimeout(() => {
      if (checkSolution(newGrid, config.solution)) {
        soundManager.firecracker();
        setShowFirecracker(true);
        setTimeout(() => setShowFirecracker(false), 3000);
        setGameState({
          ...gameState,
          currentGrid: newGrid,
          isComplete: true,
          hintsUsed: gameState.hintsUsed + 1,
        });
      }
    }, 100);
  };

  const getCellClasses = (row: number, col: number) => {
    const cell = gameState.currentGrid[row][col];
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    
    let classes = 'relative aspect-square flex items-center justify-center cursor-pointer transition-all duration-200 ';
    
    if (cell.isInitial) {
      classes += 'bg-gradient-to-br from-sky-100 to-cyan-100 font-bold text-2xl ';
    } else if (cell.isError) {
      classes += 'bg-gradient-to-br from-red-100 to-rose-100 text-red-600 dark:text-red-500 animate-pulse text-2xl ';
    } else if (isSelected) {
      classes += 'bg-gradient-to-br from-sky-200 to-cyan-200 ring-4 ring-sky-400 scale-105 shadow-lg text-2xl ';
    } else if (cell.value > 0) {
      classes += 'bg-white hover:bg-slate-50 text-2xl ';
    } else {
      classes += 'bg-white/80 hover:bg-slate-50 hover:scale-105 ';
    }
    
    return classes;
  };

  return (
    <Card className="shadow-xl border border-slate-200 bg-white backdrop-blur-sm overflow-hidden relative">
      <AnimatePresence>
        {showFirecracker && <FirecrackerAnimation />}
      </AnimatePresence>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-200/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-200/20 to-transparent rounded-full blur-3xl" />

      <CardContent className="p-4 md:p-8 relative z-10">
        {/* Sudoku Grid */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 flex justify-center"
        >
          <div
            className="inline-grid gap-0 rounded-2xl overflow-hidden shadow-xl relative"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              maxWidth: gridSize === 4 ? '360px' : '500px',
              width: '100%',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
              padding: '4px',
            }}
          >
            <AnimatePresence>
              {gameState.currentGrid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (rowIndex * gridSize + colIndex) * 0.02 }}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={getCellClasses(rowIndex, colIndex)}
                    style={{
                      borderRight: (colIndex + 1) % subGridCols === 0 && colIndex !== gridSize - 1 ? '3px solid rgba(14, 165, 233, 0.3)' : '1px solid rgba(14, 165, 233, 0.15)',
                      borderBottom: (rowIndex + 1) % subGridRows === 0 && rowIndex !== gridSize - 1 ? '3px solid rgba(14, 165, 233, 0.3)' : '1px solid rgba(14, 165, 233, 0.15)',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {cell.value > 0 ? (
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className={`${cell.isInitial ? 'font-bold text-slate-700' : 'text-slate-600'} flex items-center justify-center w-full h-full`}
                      >
                        {cell.value}
                      </motion.span>
                    ) : (
                      cell.notes && cell.notes.size > 0 && (
                        <div className="grid grid-cols-2 gap-0.5 text-xs text-slate-400 p-1 w-full h-full">
                          {Array.from({ length: gridSize }, (_, i) => i + 1).map((num) => (
                            <span key={num} className="text-center flex items-center justify-center">
                              {cell.notes!.has(num) ? num : ''}
                            </span>
                          ))}
                        </div>
                      )
                    )}
                    {/* Cell glow effect */}
                    {selectedCell?.row === rowIndex && selectedCell?.col === colIndex && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-sky-400/30 to-cyan-400/30 rounded pointer-events-none"
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Number Input */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`grid gap-2 max-w-md mx-auto ${gridSize === 4 ? 'grid-cols-4' : 'grid-cols-6'}`}
          >
            {Array.from({ length: gridSize }, (_, i) => i + 1).map((num) => (
              <motion.div key={num} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex">
                <Button
                  onClick={() => handleNumberInput(num)}
                  disabled={!selectedCell || gameState.isComplete}
                  className="w-full aspect-square p-0 !px-0 !py-0 h-auto text-xl font-bold bg-gradient-to-br from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white border-0 shadow-md disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10 w-full h-full flex items-center justify-center leading-none">{num}</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleClearCell}
                disabled={!selectedCell || gameState.isComplete}
                className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white border-0 shadow-md px-6"
                size="lg"
              >
                <Eraser className="w-5 h-5 mr-2" />
                Clear
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setNotesMode(!notesMode)}
                disabled={gameState.isComplete}
                className={`${
                  notesMode
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600'
                    : 'bg-gradient-to-r from-teal-400/50 to-emerald-400/50 hover:from-teal-500/50 hover:to-emerald-500/50'
                } text-white border-0 shadow-md px-6`}
                size="lg"
              >
                <PencilLine className="w-5 h-5 mr-2" />
                Notes {notesMode && <Badge variant="secondary" className="ml-2 bg-white/30">ON</Badge>}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleHint}
                disabled={gameState.isComplete}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-md px-6 relative overflow-hidden group"
                size="lg"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <Lightbulb className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">Hint</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}