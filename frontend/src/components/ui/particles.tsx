"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocity: { x: number; y: number };
}

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

export const Particles: React.FC<ParticlesProps> = ({
  className,
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < quantity; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * canvasSize.width,
          y: Math.random() * canvasSize.height,
          size: Math.random() * size + 0.1,
          opacity: Math.random() * 0.5 + 0.1,
          velocity: {
            x: (Math.random() - 0.5) * vx,
            y: (Math.random() - 0.5) * vy,
          },
        });
      }
      setParticles(newParticles);
    };

    if (canvasSize.width && canvasSize.height) {
      generateParticles();
    }
  }, [canvasSize, quantity, size, vx, vy, refresh]);

  useEffect(() => {
    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          x: particle.x + particle.velocity.x,
          y: particle.y + particle.velocity.y,
        }))
      );
    };

    const interval = setInterval(animateParticles, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("pointer-events-none fixed inset-0", className)}>
      <svg
        className="h-full w-full"
        width={canvasSize.width}
        height={canvasSize.height}
      >
        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={particle.size}
            fill={color}
            opacity={particle.opacity}
            initial={{ opacity: 0 }}
            animate={{ opacity: particle.opacity }}
            transition={{ duration: 1 }}
          />
        ))}
      </svg>
    </div>
  );
};
