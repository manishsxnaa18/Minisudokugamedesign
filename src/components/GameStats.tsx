import { useEffect, useState } from 'react';
import { Timer, Lightbulb, AlertCircle, RotateCcw, Home, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import type { GameState } from '../types/game';

interface GameStatsProps {
  gameState: GameState;
  onRestart: () => void;
  onNewGame: () => void;
}

export function GameStats({ gameState, onRestart, onNewGame }: GameStatsProps) {
  const [displayTime, setDisplayTime] = useState(0);

  useEffect(() => {
    if (!gameState.isComplete) {
      const interval = setInterval(() => {
        setDisplayTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState.isComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="shadow-xl border border-slate-200 bg-white backdrop-blur-sm overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-4 right-4 w-24 h-24 bg-sky-400 rounded-full blur-3xl" />
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-cyan-400 rounded-full blur-3xl" />
      </div>

      <CardContent className="p-4 md:p-6 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="flex items-center gap-3 bg-gradient-to-br from-sky-500 to-cyan-500 text-white px-4 py-3 rounded-2xl shadow-md"
            >
              <Timer className="w-6 h-6" />
              <div>
                <div className="text-xs opacity-80">Time</div>
                <div className="text-xl font-bold">{formatTime(displayTime)}</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="flex items-center gap-3 bg-gradient-to-br from-amber-500 to-orange-500 text-white px-4 py-3 rounded-2xl shadow-md"
            >
              <Lightbulb className="w-6 h-6" />
              <div>
                <div className="text-xs opacity-80">Hints</div>
                <div className="text-xl font-bold">{gameState.hintsUsed}</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              className="flex items-center gap-3 bg-gradient-to-br from-rose-500 to-red-500 text-white px-4 py-3 rounded-2xl shadow-md"
            >
              <AlertCircle className="w-6 h-6" />
              <div>
                <div className="text-xs opacity-80">Mistakes</div>
                <div className="text-xl font-bold">{gameState.mistakes}</div>
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-2"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onRestart}
                className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white border-0 shadow-md"
                size="sm"
              >
                <RotateCcw className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Restart</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onNewGame}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white border-0 shadow-md"
                size="sm"
              >
                <Home className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">New Game</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {gameState.isComplete && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <Alert className="mt-4 border-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
              <Award className="w-5 h-5 text-white" />
              <AlertTitle className="text-white font-bold text-lg">🎉 Amazing! Puzzle Complete!</AlertTitle>
              <AlertDescription className="text-white/90">
                Finished in {formatTime(displayTime)} with {gameState.hintsUsed} hints and {gameState.mistakes} mistakes
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}