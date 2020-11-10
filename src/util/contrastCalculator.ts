function luminanace(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : (v + 0.055) / 1.055 ** 2.4;
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

type RGB = [number, number, number];
export function contrast(_rgb1: string, _rgb2: string) {
  const rgb1 = hexToRgb(_rgb1.trim());
  const rgb2 = hexToRgb(_rgb2.trim());

  const lum1 = luminanace(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = luminanace(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : (hex.split(",").map((x) => +x.trim()) as RGB);
}
