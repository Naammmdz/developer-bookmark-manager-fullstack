import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  renderTime: number;
}

export const usePerformanceMonitor = (enabled: boolean = false) => {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const metricsRef = useRef<PerformanceMetrics>({ fps: 60, renderTime: 0 });

  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return;

    let animationFrameId: number;

    const measureFPS = (currentTime: number) => {
      frameCount.current++;
      
      // Calculate FPS every second
      if (currentTime >= lastTime.current + 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        metricsRef.current.fps = fps;
        
        // Log performance warnings
        if (fps < 30) {
          console.warn(`⚠️ Low FPS detected: ${fps} FPS`);
        }
        
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      animationFrameId = requestAnimationFrame(measureFPS);
    };

    // Start monitoring
    animationFrameId = requestAnimationFrame(measureFPS);

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn(`⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`, entry);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task monitoring not supported
      }

      return () => {
        cancelAnimationFrame(animationFrameId);
        observer.disconnect();
      };
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  return metricsRef.current;
};
