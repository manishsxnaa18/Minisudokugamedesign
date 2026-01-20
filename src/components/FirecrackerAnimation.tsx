import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  velocity: number;
}

export function FirecrackerAnimation() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [explosions, setExplosions] = useState<number>(0);

  useEffect(() => {
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4'];
    const burstCount = 5;
    let currentBurst = 0;

    const createBurst = () => {
      const newParticles: Particle[] = [];
      const particleCount = 50;
      const centerX = Math.random() * 60 + 20; // 20-80% of screen width
      const centerY = Math.random() * 60 + 20; // 20-80% of screen height

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: Date.now() + i + currentBurst * 1000,
          x: centerX,
          y: centerY,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle: (Math.PI * 2 * i) / particleCount,
          velocity: Math.random() * 4 + 3,
        });
      }

      setParticles((prev) => [...prev, ...newParticles]);
      setExplosions((prev) => prev + 1);

      // Remove particles after animation
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
      }, 2500);
    };

    // Create multiple bursts
    const intervals: NodeJS.Timeout[] = [];
    for (let i = 0; i < burstCount; i++) {
      const timeout = setTimeout(() => {
        createBurst();
        currentBurst++;
      }, i * 300);
      intervals.push(timeout);
    }

    return () => {
      intervals.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden bg-black/10">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}vw`,
              y: `${particle.y}vh`,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x: `${particle.x + Math.cos(particle.angle) * particle.velocity * 10}vw`,
              y: `${particle.y + Math.sin(particle.angle) * particle.velocity * 10}vh`,
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              ease: 'easeOut',
            }}
            className="absolute w-4 h-4 rounded-full shadow-lg"
            style={{ backgroundColor: particle.color, boxShadow: `0 0 20px ${particle.color}` }}
          />
        ))}
      </AnimatePresence>

      {/* Sparkles */}
      <AnimatePresence>
        {explosions > 0 && (
          <>
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                initial={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  scale: [0, 2, 0],
                  rotate: 360,
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.03,
                  ease: 'easeOut',
                }}
                className="absolute text-4xl"
              >
                ✨
              </motion.div>
            ))}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                initial={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  rotate: -360,
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.04,
                  ease: 'easeOut',
                }}
                className="absolute text-3xl"
              >
                ⭐
              </motion.div>
            ))}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`party-${i}`}
                initial={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  scale: [0, 2, 0],
                  rotate: 180,
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.05,
                  ease: 'easeOut',
                }}
                className="absolute text-5xl"
              >
                🎉
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}