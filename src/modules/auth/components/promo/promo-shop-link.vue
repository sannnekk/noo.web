<template>
  <a
    class="promo-shop-link"
    href="https://no-os.ru/god"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span class="promo-shop-link__text">
      <strong class="promo-shop-link__title">Это платформа для обучения</strong>
      <span class="promo-shop-link__subtitle">
        Купить курсы можно на нашем сайте
      </span>
    </span>
    <span class="promo-shop-link__action">Купить курсы</span>
    <svg
      class="promo-shop-link__arrow"
      viewBox="0 0 24 8"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 4h22m0 0-4-3.5M22 4l-4 3.5"
        stroke="currentColor"
        stroke-width="1"
      />
    </svg>
  </a>
</template>

<style lang="sass" scoped>
$desktop: 992px

// Mobile: one compact pill with an arrow, centred by the footer.
// Desktop: a two-line caption next to a separate green pill button.
.promo-shop-link
  display: flex
  align-items: center
  justify-content: center
  gap: 0.6rem
  // Hugs its text instead of stretching, so the pill stays the compact size
  // it has in the frames; the footer centres it
  max-width: 100%
  padding: 0.5rem 1.25rem
  border-radius: 10em
  background-color: var(--primary)
  box-shadow: inset 0 0 0 1px rgba(24, 24, 24, 0.15)
  color: inherit
  text-decoration: none
  transition: 0.2s ease opacity

  &:hover
    opacity: 0.85

  &__title
    display: none

  &__subtitle
    font-size: 0.8rem

  &__action
    display: none

  &__arrow
    flex: none
    width: 1.5rem

  @media screen and (min-width: $desktop)
    justify-content: flex-start
    gap: 2rem
    padding: 0
    border-radius: 0
    background-color: transparent
    box-shadow: none

    &:hover
      opacity: 1

    &:hover &__action
      background-color: var(--dark)
      color: var(--white)

    &__text
      display: flex
      flex-direction: column

    &__title
      display: block
      font-size: 1.05rem
      font-weight: 600

    &__subtitle
      font-size: 1.05rem

    &__action
      display: block
      flex: none
      padding: 0.85rem 1.75rem
      border-radius: 10em
      background-color: var(--primary)
      font-size: 1rem
      white-space: nowrap
      transition: 0.2s ease background-color, 0.2s ease color

    &__arrow
      display: none
</style>
