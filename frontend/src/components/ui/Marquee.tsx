import React from 'react';
import { cn } from '../../lib/utils';

interface MarqueeProps {
  children: React.ReactNode;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
  reverse?: boolean;
  className?: string;
}

const Marquee: React.FC<MarqueeProps> = ({
  children,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  reverse = false,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'group flex overflow-hidden p-2 [--duration:2s] [--gap:1rem] [gap:var(--gap)]',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn('flex shrink-0 justify-around [gap:var(--gap)]', {
            'animate-marquee flex-row': !vertical,
            'animate-marquee-vertical flex-col': vertical,
            'group-hover:[animation-play-state:paused]': pauseOnHover,
            '[animation-direction:reverse]': reverse,
          })}
        >
          {children}
        </div>
      ))}
    </div>
  );
};

export default Marquee;
