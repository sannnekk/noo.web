<template>
  <svg
    class="shpuntik-image"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 480 240"
    role="img"
    aria-label="НОО.Шпунтик"
  >
    <g class="shpuntik-image__space">
      <circle
        class="shpuntik-image__fill-primary"
        cx="160"
        cy="122"
        r="78"
      />
      <circle
        class="shpuntik-image__fill-secondary"
        cx="58"
        cy="58"
        r="14"
      />
      <circle
        class="shpuntik-image__fill-primary"
        cx="442"
        cy="188"
        r="12"
      />
      <circle
        class="shpuntik-image__fill-secondary"
        cx="382"
        cy="204"
        r="6"
      />
      <circle
        class="shpuntik-image__fill-secondary"
        cx="410"
        cy="64"
        r="30"
      />
      <ellipse
        class="shpuntik-image__line"
        cx="410"
        cy="64"
        rx="48"
        ry="12"
        transform="rotate(-18 410 64)"
      />
      <path
        class="shpuntik-image__line shpuntik-image__line--thin"
        d="M60,162 V178 M52,170 H68 M250,28 V44 M242,36 H258 M452,122 V138 M444,130 H460 M330,207 V223 M322,215 H338"
      />
      <circle
        class="shpuntik-image__fill-text"
        cx="30"
        cy="110"
        r="2.5"
      />
      <circle
        class="shpuntik-image__fill-text"
        cx="222"
        cy="222"
        r="2.5"
      />
      <circle
        class="shpuntik-image__fill-text"
        cx="368"
        cy="140"
        r="2.5"
      />
      <circle
        class="shpuntik-image__fill-text"
        cx="468"
        cy="36"
        r="2.5"
      />
      <circle
        class="shpuntik-image__fill-text"
        cx="102"
        cy="26"
        r="2.5"
      />
      <path
        class="shpuntik-image__line shpuntik-image__line--light"
        d="M58,108 H82 M48,128 H78 M64,148 H86"
      />
    </g>
    <g
      class="shpuntik-image__paper"
      transform="rotate(8 300 130)"
    >
      <rect
        class="shpuntik-image__line shpuntik-image__fill-lightest"
        x="252"
        y="72"
        width="92"
        height="116"
        rx="8"
      />
      <path
        class="shpuntik-image__line"
        d="M266,90 H316"
      />
      <path
        class="shpuntik-image__line shpuntik-image__line--success"
        d="M266,112 l6,6 l10,-10 M266,136 l6,6 l10,-10 M266,160 l6,6 l10,-10"
      />
      <path
        class="shpuntik-image__line shpuntik-image__line--light"
        d="M292,114 H330 M292,138 H326 M292,162 H330"
      />
    </g>
    <g
      class="shpuntik-image__robot"
      transform="rotate(-8 160 130)"
    >
      <path
        class="shpuntik-image__line"
        d="M128,170 Q104,178 100,200 M192,168 Q222,160 246,136 M160,70 V54"
      />
      <circle
        class="shpuntik-image__line shpuntik-image__fill-lightest"
        cx="100"
        cy="202"
        r="6"
      />
      <circle
        class="shpuntik-image__line shpuntik-image__fill-lightest"
        cx="248"
        cy="134"
        r="6"
      />
      <rect
        class="shpuntik-image__line shpuntik-image__fill-lightest"
        x="128"
        y="152"
        width="64"
        height="48"
        rx="14"
      />
      <circle
        class="shpuntik-image__fill-secondary"
        cx="160"
        cy="176"
        r="7"
      />
      <rect
        class="shpuntik-image__fill-text"
        x="100"
        y="96"
        width="10"
        height="26"
        rx="4"
      />
      <rect
        class="shpuntik-image__fill-text"
        x="210"
        y="96"
        width="10"
        height="26"
        rx="4"
      />
      <rect
        class="shpuntik-image__line shpuntik-image__fill-lightest"
        x="110"
        y="70"
        width="100"
        height="80"
        rx="26"
      />
      <path
        class="shpuntik-image__fill-text"
        fill-rule="evenodd"
        d="M169,44 L164.5,36.2 L155.5,36.2 L151,44 L155.5,51.8 L164.5,51.8 Z M160,40.5 A3.5,3.5 0 1,0 160,47.5 A3.5,3.5 0 1,0 160,40.5 Z"
      />
      <circle
        class="shpuntik-image__fill-text"
        cx="140"
        cy="104"
        r="6"
      />
      <circle
        class="shpuntik-image__fill-text"
        cx="180"
        cy="104"
        r="6"
      />
      <path
        class="shpuntik-image__line"
        d="M144,124 Q160,136 176,124"
      />
    </g>
  </svg>
</template>

<style scoped lang="sass">
.shpuntik-image
  display: block
  width: 100%
  height: auto

  &__line
    fill: none
    stroke: var(--dark-text-color)
    stroke-width: 5px
    stroke-linecap: round
    stroke-linejoin: round

    &--thin
      stroke-width: 3px

    &--light
      stroke: var(--text-light)
      stroke-width: 4px

    &--success
      stroke: var(--success)

  &__fill-primary
    fill: var(--primary)

  &__fill-secondary
    fill: var(--secondary)

  &__fill-lightest
    fill: var(--lightest)

  &__fill-text
    fill: var(--dark-text-color)
</style>
