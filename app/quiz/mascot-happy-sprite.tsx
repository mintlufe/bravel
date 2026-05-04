"use client";

import { useId } from "react";

/** Figma `121:2624` — full orb + eyes for loop-teaser mascot (`eyes="happy"`). */
export function MascotHappySpriteSvg({
  className,
}: {
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const f0 = `${uid}-f0`;
  const f1 = `${uid}-f1`;
  const f2 = `${uid}-f2`;
  const p0 = `${uid}-p0`;
  const p1 = `${uid}-p1`;
  const p2 = `${uid}-p2`;

  return (
    <svg
      width="88"
      height="88"
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <g filter={`url(#${f0})`}>
        <circle cx="44" cy="44" r="32" fill={`url(#${p0})`} />
      </g>
      <g filter={`url(#${f1})`}>
        <path
          d="M44.3593 38.6352C45 42.4478 41.903 37.527 39.1798 37.9847C36.4566 38.4423 35.1383 44.1051 34.4976 40.2926C33.8568 36.4801 35.545 33.0184 38.2683 32.5607C40.9915 32.1031 43.7185 34.8227 44.3593 38.6352Z"
          fill={`url(#${p1})`}
        />
      </g>
      <g filter={`url(#${f2})`}>
        <path
          d="M60.1381 35.9839C60.7788 39.7964 57.6818 34.8756 54.9586 35.3333C52.2354 35.791 50.9171 41.4538 50.2764 37.6412C49.6356 33.8287 51.3238 30.367 54.0471 29.9094C56.7703 29.4517 59.4973 32.1713 60.1381 35.9839Z"
          fill={`url(#${p2})`}
        />
      </g>
      <defs>
        <filter
          id={f0}
          x="0"
          y="0"
          width="88"
          height="88"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_121_2624"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_121_2624"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.682353 0 0 0 0 0.894118 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_121_2624" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.682353 0 0 0 0 0.894118 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_innerShadow_121_2624"
            result="effect3_innerShadow_121_2624"
          />
        </filter>
        <filter
          id={f1}
          x="22.3618"
          y="22.5105"
          width="34.0825"
          height="33.0942"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0196078 0 0 0 0 0.658824 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_121_2624"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0196078 0 0 0 0 0.658824 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_121_2624"
            result="effect2_dropShadow_121_2624"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_121_2624"
            result="shape"
          />
        </filter>
        <filter
          id={f2}
          x="38.1406"
          y="19.8591"
          width="34.0825"
          height="33.0942"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0196078 0 0 0 0 0.658824 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_121_2624"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0196078 0 0 0 0 0.658824 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_121_2624"
            result="effect2_dropShadow_121_2624"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_121_2624"
            result="shape"
          />
        </filter>
        <radialGradient
          id={p0}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(44 30) rotate(90) scale(46)"
        >
          <stop stopColor="#05A8FF" />
          <stop offset="0.5" stopColor="#47BFFF" />
          <stop offset="1" stopColor="#70CFFF" />
        </radialGradient>
        <linearGradient
          id={p1}
          x1="38.2683"
          y1="32.5607"
          x2="39.6605"
          y2="40.8447"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#CDF0FE" />
        </linearGradient>
        <linearGradient
          id={p2}
          x1="54.0471"
          y1="29.9094"
          x2="55.4393"
          y2="38.1934"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#CDF0FE" />
        </linearGradient>
      </defs>
    </svg>
  );
}
