import React from 'react';
import { 
  Archive, 
  Heart, 
  Clock, 
  Bookmark, 
  Layers, 
  Server, 
  Palette, 
  FileText,
  Folder,
  Star,
  Code,
  Database,
  Globe,
  Package,
  Zap,
  Coffee,
  Music,
  Camera,
  type LucideIcon
} from 'lucide-react';

// Map of icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  'archive': Archive,
  'heart': Heart,
  'clock': Clock,
  'bookmark': Bookmark,
  'layers': Layers,
  'server': Server,
  'palette': Palette,
  'filetext': FileText,
  'folder': Folder,
  'star': Star,
  'code': Code,
  'database': Database,
  'globe': Globe,
  'package': Package,
  'zap': Zap,
  'coffee': Coffee,
  'music': Music,
  'camera': Camera
};

// Get icon component for a given icon name
export const getIconComponent = (iconName?: string): LucideIcon => {
  if (!iconName) return Folder;
  
  // Check if it's a predefined icon name
  const icon = iconMap[iconName.toLowerCase()];
  if (icon) return icon;
  
  // Default to folder icon
  return Folder;
};

// Render icon with consistent props
export const renderIcon = (iconName?: string, size: number = 20, className?: string) => {
  const IconComponent = getIconComponent(iconName);
  return <IconComponent size={size} className={className} />;
};

// For custom icons (emojis or single characters), we'll create a simple component
export const CustomIcon: React.FC<{ icon: string; size?: number; className?: string }> = ({ icon, size = 20, className }) => {
  // If it's a short string (emoji or character), display it directly
  if (icon.length <= 2) {
    return (
      <span 
        className={className} 
        style={{ 
          fontSize: `${size}px`, 
          width: `${size}px`, 
          height: `${size}px`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </span>
    );
  }
  
  // Otherwise use the icon mapping
  return renderIcon(icon, size, className);
};
