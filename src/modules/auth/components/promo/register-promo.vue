<template>
  <div class="register-promo">
    <div class="register-promo__logo">
      <main-logo />
    </div>

    <div class="register-promo__intro">
      <div class="register-promo__pitch">
        <h2 class="register-promo__headline">
          <typing-text
            :words="[
              'Зарегистрируйся и получи банк заданий ЕГЭ <b>бесплатно</b>'
            ]"
            :speed="10"
            :back-delay="15000"
          />
        </h2>
        <p class="register-promo__hint">Отработай нужные темы на практике</p>
        <ul class="register-promo__subjects">
          <li
            class="register-promo__subject"
            v-for="subject in subjects"
            :key="subject"
          >
            {{ subject }}
          </li>
        </ul>
      </div>

      <div class="register-promo__faces">
        <img
          src="/register-faces.png"
          alt=""
        />
      </div>
    </div>

    <div class="register-promo__footer">
      <promo-shop-link />
      <promo-support-link />
    </div>
  </div>
</template>

<script setup lang="ts">
import PromoShopLink from './promo-shop-link.vue'
import PromoSupportLink from './promo-support-link.vue'

const subjects = [
  'Русский язык',
  'Биология',
  'Химия',
  'Профиль',
  'Физика'
] as const
</script>

<style lang="sass" scoped>
$desktop: 992px
// Widest the headline / hint / subject block is allowed to get on desktop
$pitch-width: 32rem

// Two spacing steps, and nothing else adds vertical space:
//   --block-gap  between the blocks (logo, pitch, faces, shop, support) — comes
//                from auth-layout, which also uses it for the pane padding, so
//                the logo is exactly as far from the top edge as from the pitch
//   --pitch-gap  inside the pitch (headline, lila hint, subjects)
.register-promo
  --pitch-gap: 1.15rem

  display: flex
  flex-direction: column
  flex: 1
  gap: var(--block-gap)
  text-align: center

  &__logo
    font-size: 0.85rem

    :deep(h1)
      margin: 0

  &__intro
    display: flex
    flex-direction: column
    align-items: center
    gap: var(--block-gap)

  &__pitch
    display: flex
    flex-direction: column
    align-items: center
    gap: var(--pitch-gap)
    min-width: 0

  &__headline
    display: flex
    flex-direction: column
    // Three lines are reserved so the typing animation never moves the hint or
    // the subjects, and the text sits at the bottom of that box so the gap
    // below it stays exactly the rhythm above while the line count grows
    justify-content: flex-end
    min-height: 3.9em
    margin: 0
    font-weight: 400
    font-size: clamp(1.25rem, 0.7rem + 1.6vw, 2.25rem)
    line-height: 1.3

    :deep(b)
      font-weight: 700

  &__hint
    margin: 0
    padding: 0.5rem 1.25rem
    border-radius: 10em
    background-color: var(--secondary)
    font-weight: 600
    font-size: clamp(0.8rem, 0.6rem + 0.6vw, 1.05rem)

  &__subjects
    display: flex
    flex-wrap: wrap
    justify-content: center
    gap: 0.5rem
    margin: 0
    padding: 0
    list-style: none

  &__subject
    padding: 0.4rem 1rem
    border-radius: 10em
    background-color: var(--lightest)
    font-size: clamp(0.7rem, 0.55rem + 0.5vw, 1rem)
    white-space: nowrap

  &__faces
    width: 100%

    img
      display: block
      width: 100%
      max-width: 22rem
      height: auto
      margin: 0 auto

  &__footer
    display: flex
    flex-direction: column
    align-items: center
    gap: var(--block-gap)
    flex: none

  @media screen and (min-width: $desktop)
    --pitch-gap: 1.5rem

    text-align: left

    &__logo
      font-size: 1.25rem

    // The pitch dissolves into this grid so the faces can be placed against
    // the headline and hint rows only. The row gap keeps doing the job the
    // pitch's own gap does on mobile, so the rhythm is unchanged.
    &__intro
      display: grid
      // The text column stops at its own width instead of eating the slack, so
      // the artwork centres in the space that is really left beside it. The
      // artwork column's floor comes first though: the photo is sized from its
      // height, so it needs ~1.21x that in width or it gets letterboxed and
      // stops short of the subject pills.
      grid-template-columns: minmax(0, $pitch-width) minmax(17rem, 1fr)
      column-gap: var(--block-gap)
      row-gap: var(--pitch-gap)
      align-items: start

    &__pitch
      display: contents

    &__headline
      grid-column: 1
      grid-row: 1
      // Wraps onto three lines, which is what the reserved height assumes
      max-width: 14em

    &__hint
      grid-column: 1
      grid-row: 2
      // Grid items stretch by default; the pill has to hug its text
      justify-self: start

    &__subjects
      grid-column: 1
      grid-row: 3
      justify-content: flex-start
      gap: 0.9rem
      max-width: $pitch-width

    &__subject
      padding: 0.6rem 1.5rem

    &__faces
      grid-column: 2
      // Rows 1-2 reach from the top of the headline's reserved box to the
      // bottom of the hint; the negative margin carries the box across the
      // row gap so it ends exactly where the subject pills begin
      grid-row: 1 / 3
      margin-bottom: calc(-1 * var(--pitch-gap))
      align-self: stretch
      display: flex
      justify-content: center
      min-width: 0

      img
        // Height drives the size, so the photo spans the full range above;
        // width follows from its own proportions and flex centres it
        height: 100%
        width: auto
        max-width: 100%
        object-fit: contain
        margin: 0

    &__footer
      align-items: flex-start
      // Sits at the bottom of the pane, as in the desktop frame
      margin-top: auto
      padding-top: var(--block-gap)
</style>
