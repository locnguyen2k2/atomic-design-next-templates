export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
} as const;

export const layout = {
  sidebar: {
    width: '260px',
    collapsedWidth: '72px',
  },
  header: {
    height: '64px',
  },
  maxContentWidth: '1400px',
  drawer: {
    defaultWidth: '480px',
    maxWidth: '800px',
    minWidth: '360px',
  },
} as const;

export type Spacing = typeof spacing;
export type Layout = typeof layout;
