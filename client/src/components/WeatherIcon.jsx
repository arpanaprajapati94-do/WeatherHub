import { useMemo } from 'react';

/**
 * Animated weather icon — pure SVG + SMIL (self-contained, no external CSS).
 * Maps OpenWeatherMap icon codes (01d, 02n, 10d, 13d ...) to animated visuals:
 *  - Sun with rotating rays (clear day)
 *  - Moon + twinkle (clear night)
 *  - Drifting clouds (cloudy)
 *  - Falling rain drops (rain)
 *  - Lightning bolt (thunderstorm)
 *  - Falling snow flakes (snow)
 *  - Wavy mist lines (fog/mist)
 *
 * GPU-friendly: uses only SVG transform/opacity animations.
 */

const WeatherIcon = ({ icon = '01d', size = 48, className = '' }) => {
  const type = useMemo(() => String(icon || '01d').slice(0, 2), [icon]);
  const isNight = useMemo(() => String(icon || '').endsWith('n'), [icon]);

  const hasCloud = ['02', '03', '04', '09', '10', '11', '13', '50'].includes(type);
  const hasSun = type === '01' && !isNight;
  const hasMoon = type === '01' && isNight;
  const hasRain = ['09', '10'].includes(type);
  const hasStorm = type === '11';
  const hasSnow = type === '13';
  const hasMist = type === '50';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={icon}
    >
      {/* Sun */}
      {hasSun && (
        <g>
          <circle cx="32" cy="28" r="9" fill="#FBBF24" />
          <g stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
              const r1 = 13;
              const r2 = 17;
              const x1 = 32 + r1 * Math.cos((a * Math.PI) / 180);
              const y1 = 28 + r1 * Math.sin((a * Math.PI) / 180);
              const x2 = 32 + r2 * Math.cos((a * Math.PI) / 180);
              const y2 = 28 + r2 * Math.sin((a * Math.PI) / 180);
              return (
                <line
                  key={a}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  opacity="0.9"
                  transform-origin="32 28"
                />
              );
            })}
          </g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 32 28"
            to="360 32 28"
            dur="12s"
            repeatCount="indefinite"
          />
        </g>
      )}

      {/* Moon */}
      {hasMoon && (
        <g>
          <path
            d="M36 18a11 11 0 1 0 10 16A12.5 12.5 0 0 1 36 18Z"
            fill="#E0E7FF"
          />
          <circle cx="29" cy="40" r="1.2" fill="#C7D2FE">
            <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="40" cy="46" r="1" fill="#C7D2FE">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="2.6s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* Cloud */}
      {hasCloud && (
        <g>
          <path
            d="M24 40a7 7 0 0 1-1.6-13.8 9 9 0 0 1 17.4-1.6A6.5 6.5 0 0 1 41 40Z"
            fill={hasRain || hasStorm ? '#94A3B8' : '#E2E8F0'}
          />
          <g opacity="0.55">
            <path
              d="M20 36a4.5 4.5 0 0 1-1-8.9 6 6 0 0 1 11-1.2"
              fill="#CBD5E1"
            />
          </g>
          {!hasSun && !hasMoon && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0;4 0;0 0"
              dur="5s"
              repeatCount="indefinite"
            />
          )}
        </g>
      )}

      {/* Rain */}
      {hasRain && (
        <g stroke="#60A5FA" strokeWidth="2" strokeLinecap="round">
          <line x1="22" y1="44" x2="20" y2="50">
            <animate attributeName="y1" values="44;48;44" dur="0.9s" repeatCount="indefinite" />
            <animate attributeName="y2" values="50;54;50" dur="0.9s" repeatCount="indefinite" />
          </line>
          <line x1="32" y1="44" x2="30" y2="50">
            <animate attributeName="y1" values="44;48;44" dur="1.1s" repeatCount="indefinite" />
            <animate attributeName="y2" values="50;54;50" dur="1.1s" repeatCount="indefinite" />
          </line>
          <line x1="42" y1="44" x2="40" y2="50">
            <animate attributeName="y1" values="44;48;44" dur="0.7s" repeatCount="indefinite" />
            <animate attributeName="y2" values="50;54;50" dur="0.7s" repeatCount="indefinite" />
          </line>
        </g>
      )}

      {/* Lightning */}
      {hasStorm && (
        <g>
          <path
            d="M30 44 26 52h5l-3 8 10-12h-5l4-4Z"
            fill="#FACC15"
            opacity="0"
          >
            <animate attributeName="opacity" values="0;0;1;0;0;0" dur="2.4s" repeatCount="indefinite" />
          </path>
        </g>
      )}

      {/* Snow */}
      {hasSnow && (
        <g fill="#E2E8F0">
          <circle cx="24" cy="48" r="2">
            <animate attributeName="cy" values="46;52;46" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="33" cy="48" r="2">
            <animate attributeName="cy" values="46;52;46" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="42" cy="48" r="2">
            <animate attributeName="cy" values="46;52;46" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* Mist */}
      {hasMist && (
        <g stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round">
          <line x1="20" y1="42" x2="44" y2="42" opacity="0.9" />
          <line x1="24" y1="47" x2="40" y2="47" opacity="0.6" />
          <line x1="22" y1="52" x2="43" y2="52" opacity="0.35" />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;3 0;0 0"
            dur="6s"
            repeatCount="indefinite"
          />
        </g>
      )}
    </svg>
  );
};

export default WeatherIcon;

