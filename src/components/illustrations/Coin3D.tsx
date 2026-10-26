import React from 'react';

interface CoinProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  symbol?: string;
  shiny?: boolean;
}

export const Coin3D: React.FC<CoinProps> = ({
  className = '',
  size = 'md',
  symbol = '₫',
  shiny = true,
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm overflow-visible"
      >
        <defs>
          <linearGradient id="coinGradRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2BF" />
            <stop offset="50%" stopColor="#F4CB70" />
            <stop offset="100%" stopColor="#C98B1C" />
          </linearGradient>

          <radialGradient id="coinGradFace" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#FFFBE6" />
            <stop offset="35%" stopColor="#FAD87F" />
            <stop offset="85%" stopColor="#F4CB70" />
            <stop offset="100%" stopColor="#DA9B26" />
          </radialGradient>
        </defs>

        {/* Outer Coin Body */}
        <circle cx="50" cy="50" r="46" fill="url(#coinGradRim)" />
        {/* Inner Coin Face */}
        <circle cx="50" cy="50" r="40" fill="url(#coinGradFace)" />

        {/* Decorative inner dotted border */}
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="#E6AF3E"
          strokeWidth="2.5"
          strokeDasharray="4 3"
        />

        {/* Center Symbol (VNĐ or Star) */}
        <text
          x="50"
          y="59"
          textAnchor="middle"
          fontSize="26"
          fontWeight="900"
          fontFamily="Quicksand, sans-serif"
          fill="#845507"
        >
          {symbol}
        </text>

        {/* Gloss highlight */}
        {shiny && (
          <path
            d="M 30 22 Q 52 22 68 34"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
        )}
      </svg>
    </div>
  );
};
