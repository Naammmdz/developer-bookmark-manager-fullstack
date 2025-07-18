import React, { useState } from 'react';
import { Copy, Check, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { CodeBlock as CodeBlockType } from '../../types';
import SyntaxHighlighter from './SyntaxHighlighter';

interface CodeBlockProps {
  codeBlock: CodeBlockType;
  onEdit?: (codeBlock: CodeBlockType) => void;
  onDelete?: (id: string) => void;
  isEditable?: boolean;
  showActions?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  codeBlock, 
  onEdit, 
  onDelete, 
  isEditable = false,
  showActions = true 
}) => {
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeBlock.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      javascript: 'text-yellow-400',
      typescript: 'text-blue-400',
      python: 'text-green-400',
      java: 'text-orange-400',
      'c++': 'text-purple-400',
      'c#': 'text-indigo-400',
      css: 'text-pink-400',
      html: 'text-red-400',
      sql: 'text-cyan-400',
      bash: 'text-gray-400',
      shell: 'text-gray-400',
      json: 'text-emerald-400',
      xml: 'text-red-300',
      yaml: 'text-teal-400',
      dockerfile: 'text-blue-300',
      go: 'text-cyan-300',
      rust: 'text-orange-300',
      php: 'text-purple-300',
      ruby: 'text-red-300',
      swift: 'text-orange-400',
      kotlin: 'text-violet-400',
    };
    return colors[language.toLowerCase()] || 'text-gray-300';
  };

  return (
    <div className="bg-black/20 rounded-lg border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className={`text-sm font-mono font-medium ${getLanguageColor(codeBlock.language)}`}>
            {codeBlock.language}
          </span>
          {codeBlock.title && (
            <>
              <span className="text-white/30">•</span>
              <span className="text-white/90 text-sm font-medium">{codeBlock.title}</span>
            </>
          )}
        </div>
        
        {showActions && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded text-white/60 hover:text-white/80 hover:bg-white/10 transition-colors"
              title={isCollapsed ? 'Show code' : 'Hide code'}
            >
              {isCollapsed ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            
            <button
              onClick={handleCopy}
              className="p-1.5 rounded text-white/60 hover:text-white/80 hover:bg-white/10 transition-colors"
              title="Copy code"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
            
            {isEditable && onEdit && (
              <button
                onClick={() => onEdit(codeBlock)}
                className="p-1.5 rounded text-white/60 hover:text-white/80 hover:bg-white/10 transition-colors"
                title="Edit code block"
              >
                <Edit size={16} />
              </button>
            )}
            
            {isEditable && onDelete && (
              <button
                onClick={() => onDelete(codeBlock.id)}
                className="p-1.5 rounded text-white/60 hover:text-red-400 hover:bg-white/10 transition-colors"
                title="Delete code block"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {codeBlock.description && (
        <div className="px-4 py-2 bg-white/5 border-b border-white/10">
          <p className="text-white/70 text-sm">{codeBlock.description}</p>
        </div>
      )}

{/* Code Content */}
      {!isCollapsed && (
        <div className="relative">
          <SyntaxHighlighter
            code={codeBlock.code}
            language={codeBlock.language}
          />
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
