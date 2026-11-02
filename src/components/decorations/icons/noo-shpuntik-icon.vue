<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 240 240"
  >
    <g class="moveable-forwards">
      <rect
        fill="var(--primary)"
        x="48"
        y="82"
        width="160"
        height="128"
        rx="40"
      />
      <path
        fill="var(--primary)"
        d="M204,14 Q208.5,34.5 229,39 Q208.5,43.5 204,64 Q199.5,43.5 179,39 Q199.5,34.5 204,14 Z"
      />
    </g>
    <g class="moveable-backwards">
      <rect
        style="stroke-width: 14px; fill: none; stroke: var(--secondary)"
        x="34"
        y="68"
        width="160"
        height="128"
        rx="40"
      />
      <rect
        fill="var(--secondary)"
        x="12"
        y="112"
        width="16"
        height="40"
        rx="7"
      />
      <rect
        fill="var(--secondary)"
        x="200"
        y="112"
        width="16"
        height="40"
        rx="7"
      />
      <path
        style="
          stroke-width: 12px;
          fill: none;
          stroke: var(--secondary);
          stroke-linecap: round;
        "
        d="M114,44 V62"
      />
      <path
        fill="var(--secondary)"
        fill-rule="evenodd"
        d="M130,28 L122,14.1 L106,14.1 L98,28 L106,41.9 L122,41.9 Z M114,22 A6,6 0 1,0 114,34 A6,6 0 1,0 114,22 Z"
      />
      <circle
        fill="var(--secondary)"
        cx="84"
        cy="118"
        r="13"
      />
      <circle
        fill="var(--secondary)"
        cx="144"
        cy="118"
        r="13"
      />
      <path
        style="
          stroke-width: 14px;
          fill: none;
          stroke: var(--secondary);
          stroke-linecap: round;
          stroke-linejoin: round;
        "
        d="M90,152 Q114,172 138,152"
      />
    </g>
  </svg>
</template>
