import React from 'react';

// Generates a predictable, authentic-looking QR matrix from text
function generateMatrix(text: string, size = 25): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Function to draw QR finder pattern (7x7 with 3x3 center)
  const drawFinder = (top: number, left: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[top + r][left + c] = true;
        }
      }
    }
  };

  // 3 Finder patterns (top-left, top-right, bottom-left)
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Hash string into pseudo-random modules
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  let seed = Math.abs(hash) || 12345;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Don't overwrite finders & separators
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= size - 8;
      const inBottomLeft = r >= size - 8 && c < 8;
      const isTiming = (r === 6 && c >= 8 && c < size - 8) || (c === 6 && r >= 8 && r < size - 8);

      if (!inTopLeft && !inTopRight && !inBottomLeft && !isTiming) {
        seed = (seed * 9301 + 49297) % 233280;
        matrix[r][c] = seed / 233280 > 0.48;
      }
    }
  }

  return matrix;
}

interface QRCodeSVGProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeSVG: React.FC<QRCodeSVGProps> = ({ value, size = 180, className = '' }) => {
  const matrix = React.useMemo(() => generateMatrix(value, 25), [value]);
  const cellSize = size / 25;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`bg-white p-2 rounded-2xl ${className}`}
    >
      {matrix.map((row, r) =>
        row.map((col, c) =>
          col ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.1}
              height={cellSize + 0.1}
              fill="#1F2937"
              rx={cellSize > 5 ? 1 : 0}
            />
          ) : null
        )
      )}
    </svg>
  );
};

