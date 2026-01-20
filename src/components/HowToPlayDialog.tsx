import { Grid3x3, Target, Lightbulb, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface HowToPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HowToPlayDialog({ open, onOpenChange }: HowToPlayDialogProps) {
  const rules = [
    {
      icon: Grid3x3,
      title: 'Fill the Grid',
      description: 'Every row, column, and sub-grid must contain all numbers without repetition.',
    },
    {
      icon: Target,
      title: 'Use Logic',
      description: 'No guessing needed! Each puzzle has a unique solution that can be found through logical deduction.',
    },
    {
      icon: Lightbulb,
      title: 'Get Hints',
      description: 'Stuck? Use hints to fill in a cell, but they add time penalties.',
    },
    {
      icon: Zap,
      title: 'Track Progress',
      description: 'Monitor your time and mistakes to improve your skills.',
    },
  ];

  const difficulties = [
    {
      level: 'Easy',
      description: 'Perfect for beginners. Every row/sub-grid starts with 2+ numbers.',
      badge: 'success',
    },
    {
      level: 'Moderate',
      description: 'Requires scanning across the grid. Some rows may have only 1 clue.',
      badge: 'warning',
    },
    {
      level: 'Hard',
      description: 'Advanced techniques needed. Minimal clues, maximum challenge!',
      badge: 'destructive',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>How to Play Mini Sudoku</DialogTitle>
          <DialogDescription>
            Master the rules and become a Sudoku expert
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Game Rules */}
            <div>
              <h3 className="font-semibold mb-4">Game Rules</h3>
              <div className="grid gap-4">
                {rules.map((rule, index) => {
                  const Icon = rule.icon;
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{rule.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {rule.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid Sizes */}
            <div>
              <h3 className="font-semibold mb-3">Grid Sizes</h3>
              <div className="space-y-2">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">4×4 Grid</p>
                  <p className="text-sm text-muted-foreground">
                    Uses numbers 1-4 with 2×2 sub-grids. Perfect for quick games!
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">6×6 Grid</p>
                  <p className="text-sm text-muted-foreground">
                    Uses numbers 1-6 with 2×3 sub-grids. More challenging!
                  </p>
                </div>
              </div>
            </div>

            {/* Difficulty Levels */}
            <div>
              <h3 className="font-semibold mb-3">Difficulty Levels</h3>
              <div className="space-y-3">
                {difficulties.map((diff, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{diff.level}</span>
                      <Badge
                        variant={diff.badge as any}
                        className="text-xs"
                      >
                        {diff.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {diff.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div>
              <h3 className="font-semibold mb-3">Pro Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-indigo-600">•</span>
                  <span>Use Notes mode to mark possible numbers in empty cells</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600">•</span>
                  <span>Start with rows/columns that have the most clues</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600">•</span>
                  <span>Look for "naked singles" - cells that can only have one number</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600">•</span>
                  <span>Enable Auto-Check to catch mistakes early</span>
                </li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
