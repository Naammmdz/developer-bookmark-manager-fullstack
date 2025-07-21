import React from 'react';

interface TagPillProps {
  tag: string;
  onClick?: () => void;
}

const TagPill: React.FC<TagPillProps> = ({ tag, onClick }) => {
  // Generate a consistent color based on the tag name
  const getTagColor = (tag: string) => {
    const colors = [
      'bg-primary/20 text-primary border-primary/30',
      'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'bg-amber-500/20 text-amber-400 border-amber-500/30',
    ];
    
    // Simple hash function to determine color
    const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  return (
    <span
      className={`
        ${getTagColor(tag)}
        text-xs px-2 py-1 rounded-full
        backdrop-blur-md border
        inline-flex items-center justify-center
        cursor-pointer
        transform transition-transform duration-150
        hover:scale-105 active:scale-95
      `}
      onClick={onClick}
    >
      {tag}
    </span>
  );
};

export default TagPill;