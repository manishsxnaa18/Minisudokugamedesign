import { PlayerScore } from '../App';
import { Trophy, Medal, Award } from 'lucide-react';

interface GameResultsProps {
  playerScores: PlayerScore[];
  onPlayAgain: () => void;
}

export function GameResults({ playerScores, onPlayAgain }: GameResultsProps) {
  const sortedPlayers = [...playerScores].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-5xl text-white mb-4">Game Over!</h1>
        {winner && (
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 mb-6 border-2 border-yellow-500">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
            <p className="text-3xl text-white mb-1">{winner.name} Wins!</p>
            <p className="text-xl text-yellow-400">{winner.score} points</p>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-8">
        {sortedPlayers.map((player, idx) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-4 rounded-xl ${
              idx === 0
                ? 'bg-yellow-500/20 border-2 border-yellow-500'
                : idx === 1
                ? 'bg-gray-400/20 border-2 border-gray-400'
                : idx === 2
                ? 'bg-orange-700/20 border-2 border-orange-700'
                : 'bg-white/5 border-2 border-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              {idx === 0 && <Trophy className="w-8 h-8 text-yellow-400" />}
              {idx === 1 && <Medal className="w-8 h-8 text-gray-400" />}
              {idx === 2 && <Award className="w-8 h-8 text-orange-700" />}
              {idx > 2 && <span className="w-8 text-center text-white text-xl">{idx + 1}</span>}
              <div>
                <p className="text-white text-xl">{player.name}</p>
                <p className="text-white/60 text-sm">{player.chancesLeft} chances remaining</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl text-cyan-400">{player.score}</p>
              <p className="text-sm text-white/60">points</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onPlayAgain}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
      >
        Play Again
      </button>
    </div>
  );
}
