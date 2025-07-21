import React from 'react';
import { cn } from '../../lib/utils';

interface BackgroundAnimationProps {
  className?: string;
}

const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({ className }) => {
  // Simple gradient background for cleaner look
  return (
    <div 
      className={cn(
        "absolute inset-0 z-0",
        "bg-gradient-to-br from-background via-background to-card/50",
        className
      )} 
    />
  );
};

export default BackgroundAnimation;
