export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export const range = (start, stop, step=1) => Array.from(
  { length: (stop - start) / step + 1 },
  (_, index) => start + index * step
);
