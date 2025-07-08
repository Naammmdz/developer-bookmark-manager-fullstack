import React from 'react';
import { cn } from '../../lib/utils';

interface BorderBeamProps {
  size?: number;
  duration?: number;
  anchor?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  className?: string;
}

const BorderBeam: React.FC<BorderBeamProps> = ({
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = '#ffaa40',
  colorTo = '#9c40ff',
  delay = 0,
  className = '',
}) => {
  const style = {
    '--border-width': borderWidth,
    '--size': `${size}px`,
    '--color-from': colorFrom,
    '--color-to': colorTo,
    '--delay': `${delay}s`,
    '--anchor': `${anchor}%`,
    '--duration': duration,
  } as React.CSSProperties;

  return (
    <div
      style={style}
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] border-[calc(var(--border-width)*1px)_solid_transparent]',
        // mask styles
        '![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]',
        // pseudo styles
        'after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]',
        className
      )}
    ></div>
  );
};

export default BorderBeam;

