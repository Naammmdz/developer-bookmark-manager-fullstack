import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Copy, Heart, Eye, EyeOff, Edit, Trash2, Calendar, Tag } from 'lucide-react';
import { CodeBlock as CodeBlockType } from '../../types';
import SyntaxHighlighter from '../ui/SyntaxHighlighter';

interface CodeBlockProps {
  codeBlock: CodeBlockType;
  onToggleFavorite: (id: number) => void;
  onEdit?: (codeBlock: CodeBlockType) => void;
  onDelete?: (id: string) => void;
  onClick?: (codeBlock: CodeBlockType) => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  codeBlock,
  onToggleFavorite,
  onEdit,
  onDelete,
  onClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(codeBlock.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(codeBlock.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(codeBlock);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this code block?')) {
      onDelete?.(codeBlock.id.toString());
    }
  };

  const handleClick = () => {
    onClick?.(codeBlock);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      javascript: 'bg-yellow-500/20 text-yellow-400',
      typescript: 'bg-blue-500/20 text-blue-400',
      python: 'bg-green-500/20 text-green-400',
      java: 'bg-red-500/20 text-red-400',
      'c++': 'bg-purple-500/20 text-purple-400',
      'c#': 'bg-purple-500/20 text-purple-400',
      css: 'bg-pink-500/20 text-pink-400',
      html: 'bg-orange-500/20 text-orange-400',
      sql: 'bg-indigo-500/20 text-indigo-400',
      bash: 'bg-gray-500/20 text-gray-400',
      shell: 'bg-gray-500/20 text-gray-400',
      json: 'bg-green-600/20 text-green-500',
      xml: 'bg-orange-600/20 text-orange-500',
      yaml: 'bg-red-600/20 text-red-500',
      go: 'bg-cyan-500/20 text-cyan-400',
      rust: 'bg-orange-700/20 text-orange-600',
      php: 'bg-violet-500/20 text-violet-400',
      ruby: 'bg-red-600/20 text-red-500',
      swift: 'bg-orange-500/20 text-orange-400',
      kotlin: 'bg-purple-600/20 text-purple-500',
      dart: 'bg-blue-600/20 text-blue-500',
    };
    return colors[language.toLowerCase()] || 'bg-gray-500/20 text-gray-400';
  };

  const previewCode = codeBlock.code.split('\n').slice(0, 3).join('\n');
  const hasMoreLines = codeBlock.code.split('\n').length > 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Code size={16} className="text-primary" />
            <h3 className="font-semibold text-white text-sm line-clamp-1">
              {codeBlock.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getLanguageColor(codeBlock.language)}`}>
              {codeBlock.language.toUpperCase()}
            </span>
            {codeBlock.isFavorite && (
              <Heart size={12} className="text-red-400 fill-current" />
            )}
            {codeBlock.isPublic && (
              <Eye size={12} className="text-green-400" />
            )}
            {!codeBlock.isPublic && (
              <EyeOff size={12} className="text-gray-400" />
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Copy code"
          >
            <Copy size={14} className={copied ? "text-green-400" : "text-white/70"} />
          </button>
          <button
            onClick={handleToggleFavorite}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title={codeBlock.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={14} 
              className={codeBlock.isFavorite ? "text-red-400 fill-current" : "text-white/70"} 
            />
          </button>
          {onEdit && (
            <button
              onClick={handleEdit}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Edit code block"
            >
              <Edit size={14} className="text-white/70" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Delete code block"
            >
              <Trash2 size={14} className="text-red-400" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {codeBlock.description && (
        <p className="text-white/60 text-sm mb-3 line-clamp-2">
          {codeBlock.description}
        </p>
      )}

      {/* Code Preview */}
      <div className="relative mb-3">
        <div className="bg-black/30 border border-white/10 rounded-lg overflow-hidden">
          <SyntaxHighlighter
            code={isExpanded ? codeBlock.code : previewCode + (hasMoreLines && !isExpanded ? '\n...' : '')}
            language={codeBlock.language}
            className="text-xs leading-relaxed p-3 m-0 bg-transparent"
          />
        </div>
        
        {hasMoreLines && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white/70 hover:text-white transition-colors"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Tags */}
      {codeBlock.tags && codeBlock.tags.length > 0 && (
        <div className="flex items-center gap-1 mb-3 flex-wrap">
          <Tag size={12} className="text-white/40" />
          {codeBlock.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white/60"
            >
              {tag}
            </span>
          ))}
          {codeBlock.tags.length > 3 && (
            <span className="text-xs text-white/40">
              +{codeBlock.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-white/40">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>Created {formatDate(codeBlock.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-white/5 rounded text-xs">
            {codeBlock.collection}
          </span>
        </div>
      </div>

      {/* Copy feedback */}
      {copied && (
        <div className="absolute top-2 right-2 bg-green-500/20 border border-green-500/30 rounded-lg px-2 py-1 text-xs text-green-400">
          Copied!
        </div>
      )}
    </motion.div>
  );
};

export default CodeBlock;
