<template>
  <div class="register-promo-card">
    <div class="register-promo-card__body">
      <div class="register-promo-card__text">
        <p class="register-promo-card__pitch">
          Нажми «зарегистрироваться» и получи банк заданий ЕГЭ
          <b>бесплатно</b>
        </p>
        <p class="register-promo-card__hint">
          Отработай нужные темы на практике
        </p>
      </div>
      <img
        class="register-promo-card__faces"
        src="/vlada_asif.png"
        alt=""
      />
    </div>
    <common-button
      to="/auth/register"
      alignment="stretch"
      contrast
    >
      Зарегистрироваться
    </common-button>
  </div>
</template>

<style lang="sass" scoped>
.register-promo-card
  display: flex
  flex-direction: column
  gap: 1rem
  padding: 1rem
  border-radius: 1.25rem
  background-color: var(--lightest)
  // Scales the whole card with the panel instead of a ladder of breakpoints
  font-size: clamp(0.8rem, 0.65rem + 0.5vw, 1rem)

  &__body
    display: flex
    align-items: flex-start
    gap: 0.75rem

  &__text
    flex: 1 1 auto
    min-width: 0

  &__pitch
    margin: 0
    font-size: 1.05em
    line-height: 1.35

  &__hint
    display: inline-block
    margin: 0.9em 0 0
    padding: 0.3em 1em
    border-radius: 10em
    background-color: var(--secondary)
    font-weight: 600
    font-size: 0.9em

  &__faces
    flex: none
    width: clamp(4rem, 22%, 6rem)
    height: auto

  :deep(.v-button__button)
    padding: 0.9em 1.5em
    font-size: 1.1em
    font-weight: 500
</style>
