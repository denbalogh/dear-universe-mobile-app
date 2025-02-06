export const getColorWithOpacity = (colorHex: string, opacity: number) => {
  return `${colorHex}${Math.round(opacity * 255).toString(16)}`;
};
