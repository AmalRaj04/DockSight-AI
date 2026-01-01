import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * ParticleBackground Component
 * Creates an animated background with floating molecular particles and gradient orbs
 * Implements Requirements 1.1, 1.6 - Animated molecular background elements
 */
export default function ParticleBackground() {
  // Generate 200 particles with random properties
  const particles = useMemo(() => {
    return Array.from({ length: 200 }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 2, // 2-8px
      x: Math.random() * 100, // 0-100%
      y: Math.random() * 100, // 0-100%
      duration: Math.random() * 20 + 15, // 15-35s
      delay: Math.random() * 5, // 0-5s
      opacity: Math.random() * 0.8 + 0.4, // 0.4-1.2
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 bg-blue-500/40 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 1, 0.6],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/3 right-20 w-80 h-80 bg-green-500/40 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.7, 1, 0.7],
          x: [0, -40, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-20 left-1/4 w-72 h-72 bg-purple-500/40 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.6, 0.9, 0.6],
          x: [0, 60, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-32 right-1/3 w-64 h-64 bg-blue-400/40 rounded-full blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.7, 0.9, 0.7],
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Additional gradient orbs for more visual impact */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-60 h-60 bg-cyan-500/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-10 right-10 w-48 h-48 bg-pink-500/30 rounded-full blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.7, 0.4],
          x: [0, -25, 0],
          y: [0, 35, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-500/70"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(particle.id) * 20, 0],
            opacity: [
              particle.opacity,
              particle.opacity * 1.5,
              particle.opacity,
            ],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}

      {/* Additional molecular nodes with different colors */}
      {particles.slice(0, 60).map((particle) => (
        <motion.div
          key={`green-${particle.id}`}
          className="absolute rounded-full bg-green-500/70"
          style={{
            width: particle.size * 0.8,
            height: particle.size * 0.8,
            left: `${(particle.x + 50) % 100}%`,
            top: `${(particle.y + 30) % 100}%`,
          }}
          animate={{
            y: [0, 40, 0],
            x: [0, -Math.cos(particle.id) * 15, 0],
            opacity: [
              particle.opacity * 0.8,
              particle.opacity * 1.2,
              particle.opacity * 0.8,
            ],
          }}
          transition={{
            duration: particle.duration * 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay + 2,
          }}
        />
      ))}

      {/* Third layer of particles - purple/pink */}
      {particles.slice(0, 50).map((particle) => (
        <motion.div
          key={`purple-${particle.id}`}
          className="absolute rounded-full bg-purple-500/60"
          style={{
            width: particle.size * 0.6,
            height: particle.size * 0.6,
            left: `${(particle.x + 25) % 100}%`,
            top: `${(particle.y + 60) % 100}%`,
          }}
          animate={{
            y: [0, -25, 0],
            x: [0, Math.sin(particle.id * 1.5) * 10, 0],
            opacity: [
              particle.opacity * 0.6,
              particle.opacity * 1.0,
              particle.opacity * 0.6,
            ],
          }}
          transition={{
            duration: particle.duration * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay + 1,
          }}
        />
      ))}

      {/* Fourth layer - cyan particles */}
      {particles.slice(0, 40).map((particle) => (
        <motion.div
          key={`cyan-${particle.id}`}
          className="absolute rounded-full bg-cyan-500/50"
          style={{
            width: particle.size * 0.7,
            height: particle.size * 0.7,
            left: `${(particle.x + 75) % 100}%`,
            top: `${(particle.y + 15) % 100}%`,
          }}
          animate={{
            y: [0, 35, 0],
            x: [0, -Math.cos(particle.id * 2) * 12, 0],
            opacity: [
              particle.opacity * 0.5,
              particle.opacity * 0.9,
              particle.opacity * 0.5,
            ],
          }}
          transition={{
            duration: particle.duration * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay + 3,
          }}
        />
      ))}

      {/* Connecting lines effect (more visible) */}
      <svg className="absolute inset-0 w-full h-full opacity-30">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {particles.slice(0, 40).map((particle, i) => {
          const nextParticle = particles[(i + 1) % 40];
          return (
            <motion.line
              key={`line-${i}`}
              x1={`${particle.x}%`}
              y1={`${particle.y}%`}
              x2={`${nextParticle.x}%`}
              y2={`${nextParticle.y}%`}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
