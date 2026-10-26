import React from 'react';

interface PiggyBankProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showCoin?: boolean;
  animated?: boolean;
}

export const PiggyBank3D: React.FC<PiggyBankProps> = ({
  className = '',
  size = 'md',
  showCoin = true,
  animated = true,
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    hero: 'w-36 h-36 md:w-44 md:h-44',
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          {/* Main Piggy Body Radial Gradient for 3D plump volume */}
          <radialGradient
            id="piggyBody3D"
            cx="35%"
            cy="30%"
            r="65%"
            fx="30%"
            fy="25%"
          >
            <stop offset="0%" stopColor="#FFF0F3" />
            <stop offset="35%" stopColor="#F9CAD4" />
            <stop offset="75%" stopColor="#F4ACB7" />
            <stop offset="100%" stopColor="#E292A1" />
          </radialGradient>

          {/* Ears gradient */}
          <linearGradient id="piggyEarOuter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9CCD6" />
            <stop offset="100%" stopColor="#E598A7" />
          </linearGradient>

          <linearGradient id="piggyEarInner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E88B9D" />
            <stop offset="100%" stopColor="#C96B7D" />
          </linearGradient>

          {/* Snout gradient */}
          <radialGradient
            id="piggySnout"
            cx="40%"
            cy="35%"
            r="60%"
          >
            <stop offset="0%" stopColor="#FFF3F5" />
            <stop offset="60%" stopColor="#F7B2C0" />
            <stop offset="100%" stopColor="#E3899B" />
          </radialGradient>

          {/* 3D Gold Coin gradient */}
          <linearGradient id="goldCoinFace" x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor="#FFF6D1" />
            <stop offset="30%" stopColor="#FAD277" />
            <stop offset="70%" stopColor="#F4CB70" />
            <stop offset="100%" stopColor="#D9A336" />
          </linearGradient>

          <linearGradient id="goldCoinRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCE49E" />
            <stop offset="100%" stopColor="#B8801A" />
          </linearGradient>

          {/* Soft Ground Shadow */}
          <radialGradient id="piggyGroundShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(82, 118, 154, 0.28)" />
            <stop offset="60%" stopColor="rgba(82, 118, 154, 0.12)" />
            <stop offset="100%" stopColor="rgba(82, 118, 154, 0)" />
          </radialGradient>

          {/* Cheeks blush */}
          <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F78EA2" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#F78EA2" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F78EA2" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft 3D Ground Shadow */}
        <ellipse cx="100" cy="184" rx="66" ry="12" fill="url(#piggyGroundShadow)" />

        {/* Tail curly */}
        <path
          d="M 168 115 Q 185 110 184 100 Q 183 90 172 94 Q 166 96 170 104 Q 174 110 166 116"
          stroke="#E594A4"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Back feet */}
        <ellipse cx="64" cy="168" rx="13" ry="10" fill="#E28D9E" />
        <ellipse cx="136" cy="168" rx="13" ry="10" fill="#E28D9E" />

        {/* Ears */}
        {/* Left Ear */}
        <g>
          <path
            d="M 52 70 Q 42 36 68 44 Q 78 52 72 74 Z"
            fill="url(#piggyEarOuter)"
          />
          <path
            d="M 56 65 Q 50 44 67 49 Q 72 55 68 68 Z"
            fill="url(#piggyEarInner)"
          />
        </g>

        {/* Right Ear */}
        <g>
          <path
            d="M 134 72 Q 146 38 120 44 Q 110 52 116 74 Z"
            fill="url(#piggyEarOuter)"
          />
          <path
            d="M 130 67 Q 138 46 121 50 Q 116 56 120 68 Z"
            fill="url(#piggyEarInner)"
          />
        </g>

        {/* Main Body (Plump round piggy) */}
        <ellipse cx="100" cy="122" rx="72" ry="60" fill="url(#piggyBody3D)" />

        {/* Front feet with cute toe creases */}
        <ellipse cx="78" cy="172" rx="12" ry="9" fill="#F4ACB7" stroke="#E292A1" strokeWidth="1" />
        <ellipse cx="122" cy="172" rx="12" ry="9" fill="#F4ACB7" stroke="#E292A1" strokeWidth="1" />

        {/* Glossy top-left light highlight on body */}
        <ellipse
          cx="68"
          cy="92"
          rx="26"
          ry="15"
          transform="rotate(-25 68 92)"
          fill="#FFFFFF"
          fillOpacity="0.45"
        />

        {/* Coin Slot on top */}
        <ellipse cx="100" cy="67" rx="18" ry="3.8" fill="#B35D6F" />
        <ellipse cx="100" cy="66" rx="16" ry="2.2" fill="#5E232F" />

        {/* Snout */}
        <ellipse cx="100" cy="128" rx="27" ry="19" fill="url(#piggySnout)" />
        {/* Snout highlight */}
        <ellipse cx="98" cy="118" rx="14" ry="5" fill="#FFFFFF" fillOpacity="0.4" />
        {/* Nostrils */}
        <ellipse cx="91" cy="128" rx="3.5" ry="5.5" fill="#A84C5E" />
        <ellipse cx="109" cy="128" rx="3.5" ry="5.5" fill="#A84C5E" />

        {/* Cheeks (Blushing) */}
        <ellipse cx="56" cy="132" rx="12" ry="9" fill="url(#cheekBlush)" />
        <ellipse cx="144" cy="132" rx="12" ry="9" fill="url(#cheekBlush)" />

        {/* Cute Eyes */}
        {/* Left eye */}
        <g>
          <ellipse cx="72" cy="108" rx="6" ry="7.5" fill="#2C3E50" />
          {/* Eye sparkle 1 */}
          <circle cx="70" cy="105" r="2.6" fill="#FFFFFF" />
          {/* Eye sparkle 2 */}
          <circle cx="74" cy="111" r="1.2" fill="#FFFFFF" />
        </g>
        {/* Right eye */}
        <g>
          <ellipse cx="128" cy="108" rx="6" ry="7.5" fill="#2C3E50" />
          {/* Eye sparkle 1 */}
          <circle cx="126" cy="105" r="2.6" fill="#FFFFFF" />
          {/* Eye sparkle 2 */}
          <circle cx="130" cy="111" r="1.2" fill="#FFFFFF" />
        </g>

        {/* Smiling Mouth below snout */}
        <path
          d="M 94 149 Q 100 154 106 149"
          stroke="#933B4C"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Golden Coin dropping in slot */}
        {showCoin && (
          <g className={animated ? 'animate-bounce' : ''} style={{ animationDuration: '2.5s' }}>
            {/* Coin shadow */}
            <ellipse cx="100" cy="62" rx="16" ry="4" fill="rgba(0,0,0,0.15)" />
            {/* Outer coin rim */}
            <ellipse cx="100" cy="40" rx="19" ry="19" fill="url(#goldCoinRim)" />
            {/* Coin face */}
            <ellipse cx="100" cy="40" rx="16.5" ry="16.5" fill="url(#goldCoinFace)" />
            {/* Inner rim ridge */}
            <ellipse
              cx="100"
              cy="40"
              rx="13.5"
              ry="13.5"
              fill="none"
              stroke="#E8B548"
              strokeWidth="1.2"
              strokeDasharray="2 1.5"
            />
            {/* ₫ Vietnamese Dong Currency Symbol or Star */}
            <text
              x="100"
              y="45"
              textAnchor="middle"
              fontSize="13"
              fontWeight="900"
              fontFamily="Quicksand, sans-serif"
              fill="#8A5B0B"
            >
              ₫
            </text>
            {/* Coin shine reflection */}
            <path
              d="M 92 26 Q 103 28 108 34"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />
          </g>
        )}

        {/* Sparkle star 1 */}
        <g transform="translate(156, 48)">
          <path
            d="M 0 -7 Q 1 -1 7 0 Q 1 1 0 7 Q -1 1 -7 0 Q -1 -1 0 -7 Z"
            fill="#F4CB70"
            opacity="0.9"
          />
        </g>
        {/* Sparkle star 2 */}
        <g transform="translate(36, 90)">
          <path
            d="M 0 -5 Q 1 -1 5 0 Q 1 1 0 5 Q -1 1 -5 0 Q -1 -1 0 -5 Z"
            fill="#F4CB70"
            opacity="0.8"
          />
        </g>
      </svg>
    </div>
  );
};
