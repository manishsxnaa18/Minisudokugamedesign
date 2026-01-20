import { useState, useEffect, useRef } from 'react';
import { GameConfig, PlayerScore } from '../App';
import { Trophy, Zap, Heart } from 'lucide-react';

interface GameArenaProps {
  config: GameConfig;
  playerScores: PlayerScore[];
  setPlayerScores: (scores: PlayerScore[]) => void;
  onGameEnd: () => void;
}

interface Command {
  text: string;
  textColor: string;
  targetZone: 'in' | 'out';
  targetColor?: string;
  displayLocation?: 'in' | 'out';
}

interface Segment {
  startAngle: number;
  endAngle: number;
  color: string;
  zone: 'in' | 'out';
}

const COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
const COLOR_NAMES = ['RED', 'BLUE', 'GREEN', 'ORANGE', 'PURPLE', 'PINK', 'TEAL', 'CORAL'];

export function GameArena({ config, playerScores, setPlayerScores, onGameEnd }: GameArenaProps) {
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [command, setCommand] = useState<Command | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showCommand, setShowCommand] = useState(false);
  const [roundInProgress, setRoundInProgress] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const arenaRef = useRef<HTMLDivElement>(null);

  const timeLimit = config.difficulty === 'hard' ? 1500 : 2000;

  useEffect(() => {
    startNewRound();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentPlayer]);

  const generateSegments = (): Segment[] => {
    if (config.difficulty !== 'hard') return [];

    const numSegments = Math.floor(Math.random() * 13) + 8; // 8-20 segments
    const segments: Segment[] = [];
    const angleStep = 360 / numSegments;

    // Generate segments for circle (inner)
    for (let i = 0; i < numSegments; i++) {
      segments.push({
        startAngle: i * angleStep,
        endAngle: (i + 1) * angleStep,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        zone: 'in',
      });
    }

    // Generate segments for outer box
    for (let i = 0; i < numSegments; i++) {
      segments.push({
        startAngle: i * angleStep,
        endAngle: (i + 1) * angleStep,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        zone: 'out',
      });
    }

    return segments;
  };

  const generateCommand = (segs: Segment[]): Command => {
    if (config.difficulty === 'easy') {
      const targetZone = Math.random() > 0.5 ? 'in' : 'out';
      return {
        text: targetZone === 'in' ? 'IN' : 'OUT',
        textColor: '#FFFFFF',
        targetZone,
      };
    }

    if (config.difficulty === 'moderate') {
      const targetZone = Math.random() > 0.5 ? 'in' : 'out';
      const displayLocation = Math.random() > 0.5 ? 'in' : 'out';
      return {
        text: targetZone === 'in' ? 'IN' : 'OUT',
        textColor: '#FFFFFF',
        targetZone,
        displayLocation,
      };
    }

    // Hard mode
    const targetZone = Math.random() > 0.5 ? 'in' : 'out';
    const zoneSegments = segs.filter((s) => s.zone === targetZone);
    const targetSegment = zoneSegments[Math.floor(Math.random() * zoneSegments.length)];
    const targetColorIndex = COLORS.indexOf(targetSegment.color);
    const targetColorName = COLOR_NAMES[targetColorIndex];

    // Pick a different color for text
    let textColorIndex = Math.floor(Math.random() * COLORS.length);
    while (textColorIndex === targetColorIndex) {
      textColorIndex = Math.floor(Math.random() * COLORS.length);
    }

    return {
      text: `${targetColorName} ${targetZone === 'in' ? 'IN' : 'OUT'}`,
      textColor: COLORS[textColorIndex],
      targetZone,
      targetColor: targetSegment.color,
    };
  };

  const startNewRound = () => {
    // Find next active player
    let nextPlayer = currentPlayer;
    let attempts = 0;
    while (playerScores[nextPlayer]?.isEliminated && attempts < playerScores.length) {
      nextPlayer = (nextPlayer + 1) % playerScores.length;
      attempts++;
    }

    // Check if game is over
    const activePlayers = playerScores.filter((p) => !p.isEliminated);
    if (activePlayers.length <= 1) {
      onGameEnd();
      return;
    }

    setCurrentPlayer(nextPlayer);
    setFeedback(null);
    setShowCommand(false);

    // Generate new command after a brief delay
    setTimeout(() => {
      const segs = generateSegments();
      setSegments(segs);
      const cmd = generateCommand(segs);
      setCommand(cmd);
      setShowCommand(true);
      setRoundInProgress(true);
      setTimeLeft(timeLimit);

      // Start countdown timer
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = timeLimit - elapsed;
        if (remaining <= 0) {
          handleTimeout();
        } else {
          setTimeLeft(remaining);
        }
      }, 50);
    }, 800);
  };

  const handleTimeout = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRoundInProgress(false);
    handleIncorrect();
  };

  const handleArenaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!roundInProgress || !command) return;

    const rect = arenaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const clickedZone = isPointInCircle(x, y, centerX, centerY, Math.min(rect.width, rect.height) * 0.35);

    if (config.difficulty === 'hard' && command.targetColor) {
      // Check if clicked segment matches target color and zone
      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
      const normalizedAngle = (angle + 360) % 360;

      const clickedSegment = segments.find(
        (seg) =>
          seg.zone === (clickedZone ? 'in' : 'out') &&
          normalizedAngle >= seg.startAngle &&
          normalizedAngle < seg.endAngle
      );

      if (clickedSegment?.color === command.targetColor) {
        handleCorrect();
      } else {
        handleIncorrect();
      }
    } else {
      // Easy and Moderate modes
      const correctZone = command.targetZone === 'in' ? clickedZone : !clickedZone;
      if (correctZone) {
        handleCorrect();
      } else {
        handleIncorrect();
      }
    }
  };

  const isPointInCircle = (x: number, y: number, cx: number, cy: number, radius: number): boolean => {
    const distance = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    return distance <= radius;
  };

  const handleCorrect = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRoundInProgress(false);
    setFeedback('correct');

    const speedBonus = Math.floor((timeLeft / timeLimit) * 50);
    const newScores = [...playerScores];
    newScores[currentPlayer].score += 100 + speedBonus;
    setPlayerScores(newScores);

    setTimeout(() => {
      const nextPlayer = (currentPlayer + 1) % playerScores.length;
      setCurrentPlayer(nextPlayer);
      startNewRound();
    }, 1000);
  };

  const handleIncorrect = () => {
    setFeedback('incorrect');

    const newScores = [...playerScores];
    newScores[currentPlayer].chancesLeft -= 1;
    if (newScores[currentPlayer].chancesLeft <= 0) {
      newScores[currentPlayer].isEliminated = true;
    }
    setPlayerScores(newScores);

    setTimeout(() => {
      const nextPlayer = (currentPlayer + 1) % playerScores.length;
      setCurrentPlayer(nextPlayer);
      startNewRound();
    }, 1000);
  };

  return (
    <div className="w-full max-w-6xl">
      {/* Player Stats */}
      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: `repeat(${playerScores.length}, 1fr)` }}>
        {playerScores.map((player, idx) => (
          <div
            key={player.id}
            className={`bg-white/10 backdrop-blur-lg rounded-xl p-4 border-2 transition-all ${
              idx === currentPlayer && !player.isEliminated
                ? 'border-cyan-400 shadow-lg shadow-cyan-500/50'
                : player.isEliminated
                ? 'border-red-500/50 opacity-50'
                : 'border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white">{player.name}</span>
              {idx === currentPlayer && !player.isEliminated && (
                <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
              )}
            </div>
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Trophy className="w-4 h-4" />
              <span>{player.score}</span>
            </div>
            <div className="flex items-center gap-2 text-red-400">
              <Heart className="w-4 h-4" />
              <span>{player.isEliminated ? 'ELIMINATED' : `${player.chancesLeft} left`}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Game Arena */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
        {/* Timer */}
        <div className="mb-6">
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
              style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
            />
          </div>
        </div>

        {/* Command Display */}
        {showCommand && command && (
          <div className="text-center mb-6">
            <div
              className={`inline-block px-8 py-4 rounded-xl ${
                config.difficulty === 'moderate' && command.displayLocation === 'in'
                  ? 'bg-blue-500/30'
                  : config.difficulty === 'moderate' && command.displayLocation === 'out'
                  ? 'bg-purple-500/30'
                  : 'bg-white/10'
              }`}
            >
              <p className="text-6xl" style={{ color: command.textColor }}>
                {command.text}
              </p>
            </div>
          </div>
        )}

        {/* Arena */}
        <div
          ref={arenaRef}
          className="relative w-full aspect-square max-w-2xl mx-auto cursor-pointer"
          onClick={handleArenaClick}
          style={{
            background:
              config.difficulty === 'hard'
                ? 'transparent'
                : 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3))',
          }}
        >
          {/* Hard Mode: Segmented Box */}
          {config.difficulty === 'hard' && (
            <svg className="absolute inset-0 w-full h-full">
              {/* Outer segments */}
              {segments
                .filter((s) => s.zone === 'out')
                .map((seg, idx) => {
                  const outerRadius = '50%';
                  const innerRadius = '35%';
                  return (
                    <g key={`out-${idx}`}>
                      <path
                        d={describeArc(50, 50, 50, 35, seg.startAngle, seg.endAngle)}
                        fill={seg.color}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth="1"
                      />
                    </g>
                  );
                })}
            </svg>
          )}

          {/* Circle */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white/50"
            style={{
              width: '70%',
              height: '70%',
              background:
                config.difficulty === 'hard'
                  ? 'transparent'
                  : 'linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(239, 68, 68, 0.3))',
            }}
          >
            {/* Hard Mode: Inner circle segments */}
            {config.difficulty === 'hard' && (
              <svg className="absolute inset-0 w-full h-full">
                {segments
                  .filter((s) => s.zone === 'in')
                  .map((seg, idx) => (
                    <path
                      key={`in-${idx}`}
                      d={describeArc(50, 50, 50, 0, seg.startAngle, seg.endAngle)}
                      fill={seg.color}
                      stroke="rgba(0,0,0,0.3)"
                      strokeWidth="1"
                    />
                  ))}
              </svg>
            )}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
              <div
                className={`text-8xl ${
                  feedback === 'correct' ? 'text-green-400' : 'text-red-400'
                } animate-pulse`}
              >
                {feedback === 'correct' ? '✓' : '✗'}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-white/70 text-sm">
          {config.difficulty === 'easy' && <p>Tap IN (circle) or OUT (box) based on the command</p>}
          {config.difficulty === 'moderate' && <p>Follow the TEXT command, not where it appears!</p>}
          {config.difficulty === 'hard' && <p>Find the segment with the BACKGROUND color mentioned in the text!</p>}
        </div>
      </div>
    </div>
  );
}

// Helper function to create SVG arc paths
function describeArc(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(centerX, centerY, outerRadius, endAngle);
  const end = polarToCartesian(centerX, centerY, outerRadius, startAngle);
  const innerStart = polarToCartesian(centerX, centerY, innerRadius, endAngle);
  const innerEnd = polarToCartesian(centerX, centerY, innerRadius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  if (innerRadius === 0) {
    // Pie slice for circle
    return [
      'M',
      centerX,
      centerY,
      'L',
      start.x,
      start.y,
      'A',
      outerRadius,
      outerRadius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      'Z',
    ].join(' ');
  } else {
    // Ring segment for outer area
    return [
      'M',
      start.x,
      start.y,
      'A',
      outerRadius,
      outerRadius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      'L',
      innerEnd.x,
      innerEnd.y,
      'A',
      innerRadius,
      innerRadius,
      0,
      largeArcFlag,
      1,
      innerStart.x,
      innerStart.y,
      'Z',
    ].join(' ');
  }
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
