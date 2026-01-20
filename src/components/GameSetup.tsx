import { useState } from 'react';
import { Settings, Zap, Brain, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import type { GridSize, Difficulty, GameConfig } from '../types/game';
import { generatePuzzle } from '../utils/puzzleGenerator';
import { useUser } from '../contexts/UserContext';

interface GameSetupProps {
  onStartGame: (config: GameConfig) => void;
}

export function GameSetup({ onStartGame }: GameSetupProps) {
  const { settings } = useUser();
  const [gridSize, setGridSize] = useState<GridSize>(4);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const handleStart = () => {
    const { initialGrid, solution } = generatePuzzle(gridSize, difficulty);
    onStartGame({
      gridSize,
      difficulty,
      initialGrid,
      solution,
      autoCheck: settings.autoCheck,
    });
  };

  const difficultyInfo = {
    easy: {
      icon: Zap,
      label: 'Easy',
      description: 'The Quick Start - Perfect for beginners',
      clues: gridSize === 4 ? '8-10 clues' : '18-22 clues',
      gradient: 'from-emerald-500 to-teal-500',
      iconBg: 'from-emerald-400 to-teal-400',
    },
    moderate: {
      icon: Target,
      label: 'Moderate',
      description: 'The Logical Step - Requires scanning',
      clues: gridSize === 4 ? '6-7 clues' : '12-15 clues',
      gradient: 'from-amber-500 to-orange-500',
      iconBg: 'from-amber-400 to-orange-400',
    },
    hard: {
      icon: Brain,
      label: 'Hard',
      description: 'The Brain Teaser - Advanced techniques',
      clues: gridSize === 4 ? '4-5 clues' : '9-11 clues',
      gradient: 'from-rose-500 to-red-500',
      iconBg: 'from-rose-400 to-red-400',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-xl border border-slate-200 bg-white overflow-hidden relative">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sky-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-200/20 to-transparent rounded-full blur-3xl" />

        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-md">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl text-slate-700">Game Setup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          {/* Grid Size Selection */}
          <div>
            <Label className="block mb-3 text-lg font-semibold">Grid Size</Label>
            <div className="flex justify-center gap-4">
              {([4, 6] as GridSize[]).map((size) => (
                <motion.div
                  key={size}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-36"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className={`w-full h-auto py-6 flex-col border-2 transition-all ${
                      gridSize === size
                        ? 'bg-gradient-to-br from-sky-500 to-cyan-500 text-white border-transparent shadow-lg scale-105'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-sky-300'
                    }`}
                    onClick={() => setGridSize(size)}
                  >
                    <div className="text-xl font-bold">{size}×{size} Grid</div>
                    <div className="text-sm opacity-90">Numbers 1-{size}</div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <Label className="block mb-3 text-lg font-semibold">Difficulty</Label>
            <div className="space-y-3">
              {(Object.keys(difficultyInfo) as Difficulty[]).map((diff) => {
                const info = difficultyInfo[diff];
                const Icon = info.icon;
                const isSelected = difficulty === diff;
                return (
                  <motion.div
                    key={diff}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className={`w-full h-auto py-5 justify-start border-2 transition-all ${
                        isSelected
                          ? `bg-gradient-to-r ${info.gradient} text-white border-transparent shadow-lg`
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setDifficulty(diff)}
                    >
                      <div className="flex items-start gap-4 w-full">
                        <div className={`w-14 h-14 bg-gradient-to-br ${isSelected ? 'from-white/30 to-white/10' : info.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                          <Icon className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-white'}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-lg">{info.label}</span>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${isSelected ? 'bg-white/20 text-white border-white/30' : ''}`}
                            >
                              {info.clues}
                            </Badge>
                          </div>
                          <div className={`text-sm ${isSelected ? 'opacity-90' : 'text-muted-foreground'}`}>
                            {info.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Start Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleStart} 
              className="w-full h-16 text-lg font-bold bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-lg relative overflow-hidden group"
              size="lg"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              <span className="relative z-10">Start Game</span>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}