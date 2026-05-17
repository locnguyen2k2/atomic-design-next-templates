import React from 'react';

interface LiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  blur?: number;
  opacity?: number;
  borderOpacity?: number;
  shadowIntensity?: number;
  tint?: 'white' | 'dark' | 'custom';
  customTint?: string;
}

export function LiquidGlass({
  children,
  className = '',
  blur = 16,
  opacity = 0.1,
  borderOpacity = 0.2,
  shadowIntensity = 0.1,
  tint = 'white',
  customTint,
}: LiquidGlassProps) {
  const getBackground = () => {
    if (tint === 'custom' && customTint) {
      return customTint;
    }
    if (tint === 'dark') {
      return `rgba(0, 0, 0, ${opacity})`;
    }
    return `rgba(255, 255, 255, ${opacity})`;
  };

  const getBorderColor = () => {
    if (tint === 'dark') {
      return `rgba(255, 255, 255, ${borderOpacity})`;
    }
    return `rgba(255, 255, 255, ${borderOpacity})`;
  };

  const baseStyles = `
    backdrop-filter: blur(${blur}px);
    -webkit-backdrop-filter: blur(${blur}px);
    background: ${getBackground()};
    border: 1px solid ${getBorderColor()};
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, ${shadowIntensity}),
      inset 0 1px 0 rgba(255, 255, 255, ${borderOpacity * 0.5});
  `;

  return (
    <div
      className={className}
      style={{
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        background: getBackground(),
        border: `1px solid ${getBorderColor()}`,
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, ${shadowIntensity}),
          inset 0 1px 0 rgba(255, 255, 255, ${borderOpacity * 0.5})
        `,
      }}
    >
      {children}
    </div>
  );
}
