export const transitions = {
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '350ms ease',
} as const;

export const animations = {
  fadeIn: 'fadeIn 0.25s ease forwards',
  fadeUp: 'fadeUp 0.4s ease forwards',
  slideIn: 'slideIn 0.3s ease forwards',
  pulse: 'pulse 2s infinite',
} as const;

export type Transitions = typeof transitions;
export type Animations = typeof animations;
