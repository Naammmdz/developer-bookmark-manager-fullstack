import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CodeBlock as CodeBlockType } from '../../types';
import CodeBlock from './CodeBlock';

interface CodeBlockGridProps {
  codeBlocks: CodeBlockType[];
  onToggleFavorite: (id: number) => void;
  onEdit?: (codeBlock: CodeBlockType) => void;
  onDelete?: (id: string) => void;
  onCodeBlockClick?: (codeBlock: CodeBlockType) => void;
  viewMode?: 'grid' | 'list';
}

const CodeBlockGrid: React.FC<CodeBlockGridProps> = ({
  codeBlocks,
  onToggleFavorite,
  onEdit,
  onDelete,
  onCodeBlockClick,
  viewMode = 'grid',
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (codeBlocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-white/30" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white/80 mb-2">No code blocks found</h3>
        <p className="text-white/50 max-w-md">
          Create your first code block to start building your collection of useful code snippets.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'flex flex-col gap-4'
      }
    >
      <AnimatePresence mode="popLayout">
        {codeBlocks.map((codeBlock) => (
          <motion.div
            key={codeBlock.id}
            variants={itemVariants}
            layout
            exit={{ opacity: 0, scale: 0.8 }}
            className={viewMode === 'list' ? 'w-full' : ''}
          >
            <CodeBlock
              codeBlock={codeBlock}
              onToggleFavorite={onToggleFavorite}
              onEdit={onEdit}
              onDelete={onDelete}
              onClick={onCodeBlockClick}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default CodeBlockGrid;
