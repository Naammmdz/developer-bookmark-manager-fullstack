import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  animate = true,
  delay = 0,
  onClick
}) => {
  const cardClasses = "glass glass-hover";
  
  return animate ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={`${cardClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  ) : (
    <div 
      className={`${cardClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;