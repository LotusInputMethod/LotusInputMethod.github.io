import { ref } from 'vue';

export const catppuccinThemes = [
  'latte',
  'frappe',
  'macchiato',
  'mocha',
] as const;
export type CatppuccinTheme = (typeof catppuccinThemes)[number];

const themeBaseColor: Record<CatppuccinTheme, string> = {
  latte: '#eff1f5',
  frappe: '#303446',
  macchiato: '#24273a',
  mocha: '#1e1e2e',
};

const currentTheme = ref<CatppuccinTheme>('mocha');

const setThemeColor = (theme: CatppuccinTheme): void => {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', themeBaseColor[theme]);
};

const applyTheme = (theme: CatppuccinTheme): void => {
  currentTheme.value = theme;
  document.documentElement.setAttribute('data-theme', theme);
  setThemeColor(theme);
  localStorage.setItem('catppuccin-theme', theme);
};

const cycleTheme = (): void => {
  const currentIndex = catppuccinThemes.indexOf(currentTheme.value);
  const nextIndex = (currentIndex + 1) % catppuccinThemes.length;
  applyTheme(catppuccinThemes[nextIndex] as CatppuccinTheme);
};

const formatThemeName = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1);

const initTheme = (): void => {
  const savedTheme = localStorage.getItem('catppuccin-theme');
  if (savedTheme && catppuccinThemes.includes(savedTheme as CatppuccinTheme)) {
    currentTheme.value = savedTheme as CatppuccinTheme;
  } else if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches
  ) {
    currentTheme.value = 'latte';
  } else {
    currentTheme.value = 'mocha';
  }

  document.documentElement.setAttribute('data-theme', currentTheme.value);
  setThemeColor(currentTheme.value);
};

export function useTheme() {
  return { currentTheme, cycleTheme, formatThemeName };
}

export { initTheme };
