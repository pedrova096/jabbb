export const colors = {
  primary: '#c10b0b',
  primaryLight: '#CDD7DD',
  primaryGray: '#63354d',
  primaryDark: '#3a001e',
  light: '#FFFFFF',
  dark: '#21191d',
  green: '#4CA600',
};

export const sidesGap = 25;

export const addOpacity = (color: string, opacity: number) => {
  const opacityHex = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
  return `${color.substring(0, 7)}${opacityHex}`;
};
