import React, { useEffect, useState } from 'react';

interface AmbientDecorProps {
  accentColor?: 'cyan' | 'magenta' | 'amber' | 'indigo';
}

export const AmbientDecor: React.FC<AmbientDecorProps> = ({ accentColor = 'cyan' }) => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate percentage coordinates for fluid responsive radial gradients
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Determine glow hues based on active theme
  const getGlowHues = () => {
    switch (accentColor) {
      case 'magenta':
        return {
          primary: 'rgba(217, 70, 239, 0.16)',
          secondary: 'rgba(244, 63, 94, 0.08)',
          beam: 'rgba(217, 70, 239, 0.22)',
        };
      case 'amber':
        return {
          primary: 'rgba(245, 158, 11, 0.15)',
          secondary: 'rgba(234, 88, 12, 0.08)',
          beam: 'rgba(245, 158, 11, 0.20)',
        };
      case 'indigo':
        return {
          primary: 'rgba(99, 102, 241, 0.16)',
          secondary: 'rgba(168, 85, 247, 0.08)',
          beam: 'rgba(99, 102, 241, 0.22)',
        };
      case 'cyan':
      default:
        return {
          primary: 'rgba(6, 182, 212, 0.15)',
          secondary: 'rgba(59, 130, 246, 0.08)',
          beam: 'rgba(6, 182, 212, 0.22)',
        };
    }
  };

  const hues = getGlowHues();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Dynamic Cursor Spotlight Following Pointer */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}% ${mousePos.y}%, ${hues.beam}, transparent 70%)`,
        }}
      />

      {/* Primary Ambient Atmosphere Blob (Top Left) */}
      <div
        className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full blur-[140px] transition-colors duration-1000 ease-out"
        style={{ backgroundColor: hues.primary }}
      />

      {/* Secondary Ambient Atmosphere Blob (Center Right) */}
      <div
        className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full blur-[150px] transition-colors duration-1000 ease-out"
        style={{ backgroundColor: hues.secondary }}
      />

      {/* Deep Cyberpunk Ground Grid Reflection */}
      <div className="absolute bottom-0 inset-x-0 h-96 opacity-25 perspective-grid [mask-image:linear-gradient(to_bottom,transparent,black)]" />

      {/* Top Hairline Neon Horizon */}
      <div
        className="absolute top-0 inset-x-0 h-px transition-colors duration-700"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${hues.beam} 50%, transparent 100%)`,
        }}
      />

      {/* Subtle Floating Ambient Light Pixels */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 rounded-full bg-cyan-400 blur-[1px] animate-pulse" />
        <div className="absolute top-[45%] left-[82%] w-1.5 h-1.5 rounded-full bg-fuchsia-400 blur-[1px] animate-pulse" style={{ animationDelay: '1.2s' }} />
        <div className="absolute top-[70%] left-[28%] w-1 h-1 rounded-full bg-amber-400 blur-[0.5px] animate-pulse" style={{ animationDelay: '2.4s' }} />
        <div className="absolute top-[85%] left-[64%] w-1.5 h-1.5 rounded-full bg-cyan-300 blur-[1px] animate-pulse" style={{ animationDelay: '0.8s' }} />
      </div>
    </div>
  );
};
