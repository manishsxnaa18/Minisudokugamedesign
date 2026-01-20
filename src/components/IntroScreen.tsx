import { motion } from 'motion/react';
import { Brain, Zap, Trophy, Play, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface IntroScreenProps {
  onGetStarted: () => void;
}

export function IntroScreen({ onGetStarted }: IntroScreenProps) {
  const features = [
    {
      icon: Brain,
      title: 'Train Your Brain',
      description: 'Sharpen your logical thinking with quick puzzles',
      color: 'from-sky-400 to-cyan-400',
    },
    {
      icon: Zap,
      title: 'Multiple Difficulties',
      description: 'From beginner-friendly to expert challenges',
      color: 'from-teal-400 to-emerald-400',
    },
    {
      icon: Trophy,
      title: 'Track Progress',
      description: 'Monitor your time and improve your skills',
      color: 'from-blue-400 to-indigo-400',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE2djguNGwtOC40IDguNC04LjQtOC40VjE2aDguNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
      </div>

      {/* Floating Elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-sky-300/30 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-6 relative"
          >
            <div className="w-32 h-32 bg-white backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center shadow-xl border border-slate-200 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-sky-100/50 to-transparent"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              <div className="grid grid-cols-2 gap-2 p-6 relative z-10">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-xl shadow-sm"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
            </div>
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <Sparkles className="w-8 h-8 text-amber-400" fill="currentColor" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-6xl font-bold text-slate-700 mb-4 tracking-tight"
          >
            Mini Sudoku
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-slate-600"
          >
            Challenge your mind with quick logic puzzles
          </motion.p>
        </div>

        <div className="grid gap-4 mb-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="group"
              >
                <div className="p-5 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-slate-700 mb-1 text-lg">{feature.title}</h3>
                      <p className="text-slate-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onGetStarted}
            size="lg"
            className="w-full h-16 text-lg bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold shadow-lg rounded-2xl relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <Play className="w-6 h-6 mr-2 relative z-10" />
            <span className="relative z-10">Get Started</span>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}