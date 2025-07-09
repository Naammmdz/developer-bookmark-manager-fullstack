import React from 'react';
import { cn } from '../../lib/utils';
import { useInView } from '../../hooks/useInView';

interface CtaCardProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

const CtaCard: React.FC<CtaCardProps> = ({ children, id, className }) => {
  const { ref, inView } = useInView({
    rootMargin: '-50px',
    unobserveOnEnter: true,
  });

  return (
    <div
      ref={ref}
      id={id}
      className={cn(
        'relative size-20 cursor-pointer overflow-hidden rounded-2xl p-4 transition-opacity duration-1000',
        // dark styles only
          'transform-gpu bg-black/50 [box-shadow:0_-30px_100px_-20px_#000000]',
        inView ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        transitionDelay: inView ? `${Math.random() * 2}s` : '0s',
      }}
    >
      {children}
    </div>
  );
};

export default CtaCard;
