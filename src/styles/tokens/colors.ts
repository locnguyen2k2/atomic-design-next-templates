export const colors = {
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  accent: {
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
  },
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  violet: '#8b5cf6',
  bg: {
    DEFAULT: '#0a0a0f',
    elevated: '#12121a',
    surface: '#1a1a24',
  },
  text: {
    primary: '#f4f4f5',
    secondary: '#a1a1aa',
    muted: '#71717a',
  },
  border: {
    DEFAULT: '#27272a',
    subtle: '#1f1f23',
  },
} as const;

export type Color = typeof colors;
