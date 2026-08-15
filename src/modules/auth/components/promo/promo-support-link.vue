<template>
  <p class="promo-support-link">
    Возникли вопросы?<span class="promo-support-link__break"></span>
    Обратись к нам в
    <a
      href="https://vk.me/noobiology"
      target="_blank"
      rel="noopener noreferrer"
    >
      VK
    </a>
    или
    <a
      href="https://t.me/noohelp_bot?start=platform"
      target="_blank"
      rel="noopener noreferrer"
    >
      Telegram
    </a>
  </p>
</template>

<style lang="sass" scoped>
$desktop: 992px

.promo-support-link
  margin: 0
  font-size: 0.75rem

  // Breaks the sentence in two on narrow screens without an extra <br> tag
  &__break
    display: block

  a
    color: var(--auth-link-color)
    font-weight: 600
    text-decoration: none

    &:hover
      text-decoration: underline

  @media screen and (min-width: $desktop)
    font-size: 1.05rem

    &__break
      display: inline

      &::before
        content: ' '
</style>
