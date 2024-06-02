export type Theme = {
  foreground: string;
  background: string;
  primary: string;
  error: string;
  dimmed: string;
};

export const themeOnedark: Theme = {
  foreground: '#abb2bf',
  background: '#282c34',
  primary: '#61afef',
  error: '#e06c75',
  dimmed: '#545862',
};

export const themeOnelight: Theme = {
  foreground: '#3a3c43',
  background: '#fafafa',
  primary: '#50a14f',
  error: '#e45649',
  dimmed: '#a0a1a7',
};

export const themeMonokai: Theme = {
  foreground: '#f8f8f2',
  background: '#272822',
  primary: '#a6e22e',
  error: '#f92672',
  dimmed: '#75715e',
};

export const themeSolarizedDark: Theme = {
  foreground: '#93a1a1',
  background: '#002b36',
  primary: '#859900',
  error: '#dc322f',
  dimmed: '#657b83',
};

export const themeSolalizedLight: Theme = {
  foreground: '#586e75',
  background: '#fdf6e3',
  primary: '#859900',
  error: '#dc322f',
  dimmed: '#839496',
};

export const themeSakura: Theme = {
  foreground: '#564448',
  background: '#feedf3',
  primary: '#df2d52',
  error: '#2e916d',
  dimmed: '#755f64',
};

export const debugNextTheme = (
  themeId: number,
): { themeId: number; theme: Theme } => {
  const thems = [
    themeOnedark,
    themeOnelight,
    themeMonokai,
    themeSolarizedDark,
    themeSolalizedLight,
    themeSakura,
  ];
  themeId = (themeId + 1) % thems.length;
  const theme = thems[themeId];
  return { themeId, theme };
};
