<template>
  <transition name="open">
    <div
      v-if="visible"
      class="overlay-hint"
      :style="{
        top: positionModel.y + 'px',
        left: positionModel.x - 20 + 'px',
        position: absolute ? 'absolute' : 'fixed'
      }"
      ref="hintEl"
    >
      <div class="overlay-hint__content">
        <span
          class="overlay-hint__content__arrow-top"
          :style="{
            left:
              positionModel.notFittingWidth > 0
                ? 28 + positionModel.notFittingWidth + 'px'
                : '28px'
          }"
        >
        </span>
        <span
          class="overlay-hint__content__close"
          @click="hideHint()"
        >
          +
        </span>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

interface Props {
  position: { x: number; y: number }
  visible: boolean
  absolute?: boolean
  hideOnOutsideClick?: boolean
  hideOnScroll?: boolean
}

interface Emits {
  (event: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const hintEl = ref<HTMLElement | null>(null)

const positionModel = computed(() => {
  if (!props.position || !hintEl.value)
    return { x: 0, y: 0, notFittingWidth: 0, notFittingHeight: 0 }

  const actualWidth = hintEl.value.offsetWidth
  const actualHeight = hintEl.value.offsetHeight

  const notFittingWidth = props.position.x + actualWidth - window.innerWidth
  const notFittingHeight = props.position.y + actualHeight - window.innerHeight

  const x =
    notFittingWidth > 0 ? props.position.x - notFittingWidth : props.position.x
  const y =
    notFittingHeight > 0
      ? props.position.y - notFittingHeight
      : props.position.y

  return { x, y, notFittingWidth, notFittingHeight }
})

function hideHint() {
  emits('update:visible', false)
}

function onOpen() {
  openingTimestamp = Date.now()
}

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      onOpen()
    }
  }
)

// To prevent the hint from closing immediately after opening
let openingTimestamp = 0

function handleOutsideClick(e: MouseEvent) {
  if (
    props.hideOnOutsideClick &&
    props.visible &&
    hintEl.value &&
    !hintEl.value.contains(e.target as Node) &&
    Date.now() - openingTimestamp > 250
  ) {
    hideHint()
  }
}

function handleScroll() {
  if (props.hideOnScroll && props.visible) {
    hideHint()
  }
}

onMounted(() => {
  if (props.hideOnOutsideClick) {
    window.addEventListener('click', handleOutsideClick)
  }

  if (props.hideOnScroll) {
    window.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (props.hideOnOutsideClick) {
    window.removeEventListener('click', handleOutsideClick)
  }

  if (props.hideOnScroll) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped lang="sass">
.open-enter-active, .open-leave-active
  transition: opacity 0.2s ease, transform 0.2s ease

.open-enter, .open-leave-to
  opacity: 0
  transform: translateY(20px)

.open-enter-to, .open-leave
  opacity: 1
  transform: translateY(0)

.overlay-hint
  z-index: 1000
  max-width: min(500px, 100%)
  padding: 10px

  &__content
    background-color: var(--lightest)
    border-radius: var(--border-radius)
    padding: 0.8em
    box-shadow: 0px 0px 15px #00000055
    border-radius: var(--border-radius)

    &__arrow-top
      content: ''
      position: absolute
      width: 0
      height: 0
      border-left: 10px solid transparent
      border-right: 10px solid transparent
      border-bottom: 10px solid var(--lightest)
      top: 0px
      left: 28px

    &__close
      cursor: pointer
      font-size: 2em
      margin-right: 0.5em
      transition: transform 0.2s
      transform: rotate(45deg)
      position: absolute
      top: 5px
      right: 5px
      color: var(--lila)

      &:hover
        color: var(--text-light)
</style>
