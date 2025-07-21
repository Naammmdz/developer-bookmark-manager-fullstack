import React from 'react';
import { cn } from '../../lib/utils';

interface PerformanceSettingsProps {
  className?: string;
}

export const PerformanceSettings: React.FC<PerformanceSettingsProps> = ({ className }) => {
  const [settings, setSettings] = React.useState({
    reducedMotion: false,
    lowPowerMode: false,
    animationSpeed: 'normal' as 'slow' | 'normal' | 'fast',
  });

  React.useEffect(() => {
    // Check system preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSettings(prev => ({ ...prev, reducedMotion: mediaQuery.matches }));
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    
    // Apply settings
    if (key === 'reducedMotion') {
      document.documentElement.classList.toggle('reduce-motion', !settings[key]);
    }
    if (key === 'lowPowerMode') {
      document.documentElement.classList.toggle('low-power', !settings[key]);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold mb-4">Performance Settings</h3>
      
      <div className="space-y-3">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="font-medium">Reduce Motion</p>
            <p className="text-sm text-muted-foreground">Minimize animations for better performance</p>
          </div>
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={() => handleToggle('reducedMotion')}
            className="w-4 h-4 rounded accent-primary"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="font-medium">Low Power Mode</p>
            <p className="text-sm text-muted-foreground">Disable background animations</p>
          </div>
          <input
            type="checkbox"
            checked={settings.lowPowerMode}
            onChange={() => handleToggle('lowPowerMode')}
            className="w-4 h-4 rounded accent-primary"
          />
        </label>

        <div>
          <p className="font-medium mb-2">Animation Speed</p>
          <select
            value={settings.animationSpeed}
            onChange={(e) => setSettings(prev => ({ ...prev, animationSpeed: e.target.value as any }))}
            className="w-full px-3 py-2 rounded-lg glass border border-border text-sm"
          >
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
        <p className="text-sm">
          💡 Tip: Enable "Reduce Motion" if you experience performance issues or prefer minimal animations.
        </p>
      </div>
    </div>
  );
};
