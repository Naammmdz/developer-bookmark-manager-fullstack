"use client";

import { cn } from "../../lib/utils";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface OptimizedFlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
  fps?: number; // Add FPS control
  enabled?: boolean; // Add toggle for enabling/disabling animation
}

export const OptimizedFlickeringGrid: React.FC<OptimizedFlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.1,
  color = "rgb(59, 130, 246)",
  width,
  height,
  className,
  maxOpacity = 0.1,
  fps = 30, // Default to 30 FPS instead of 60
  enabled = true,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const frameInterval = 1000 / fps;
  const lastFrameTimeRef = useRef(0);

  // Use CSS custom property for color to avoid re-parsing
  const memoizedColor = useMemo(() => {
    return color;
  }, [color]);

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR at 2 for performance
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const cols = Math.floor(width / (squareSize + gridGap));
      const rows = Math.floor(height / (squareSize + gridGap));

      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      // Update fewer squares per frame for better performance
      const updateCount = Math.min(
        Math.floor(squares.length * flickerChance * deltaTime),
        Math.ceil(squares.length * 0.1) // Update max 10% of squares per frame
      );
      
      for (let i = 0; i < updateCount; i++) {
        const randomIndex = Math.floor(Math.random() * squares.length);
        squares[randomIndex] = Math.random() * maxOpacity;
      }
    },
    [flickerChance, maxOpacity],
  );

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      // Clear canvas only once
      ctx.clearRect(0, 0, width, height);
      
      // Batch similar operations
      ctx.save();
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const opacity = squares[i * rows + j];
          if (opacity > 0.01) { // Skip nearly invisible squares
            ctx.fillStyle = `${memoizedColor}`;
            ctx.globalAlpha = opacity;
            ctx.fillRect(
              i * (squareSize + gridGap) * dpr,
              j * (squareSize + gridGap) * dpr,
              squareSize * dpr,
              squareSize * dpr,
            );
          }
        }
      }
      
      ctx.restore();
    },
    [memoizedColor, squareSize, gridGap],
  );

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false }); // Disable alpha for better performance
    if (!ctx) return;

    let animationFrameId: number;
    let gridParams: ReturnType<typeof setupCanvas>;

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth;
      const newHeight = height || container.clientHeight;
      setCanvasSize({ width: newWidth, height: newHeight });
      gridParams = setupCanvas(canvas, newWidth, newHeight);
    };

    updateCanvasSize();

    const animate = (time: number) => {
      if (!isInView) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // Frame rate limiting
      const elapsed = time - lastFrameTimeRef.current;
      if (elapsed < frameInterval) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      lastFrameTimeRef.current = time - (elapsed % frameInterval);
      const deltaTime = elapsed / 1000;

      updateSquares(gridParams.squares, deltaTime);
      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        gridParams.cols,
        gridParams.rows,
        gridParams.squares,
        gridParams.dpr,
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    // Use passive event listeners for better performance
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '50px' }, // Add root margin for earlier loading
    );

    intersectionObserver.observe(canvas);

    if (isInView) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView, frameInterval, enabled]);

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full", className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          willChange: 'transform', // Optimize for GPU
        }}
      />
    </div>
  );
};
