<template>
  <div
    class="push-notifications-form__install"
    v-if="needsInstall"
  >
    <info-block>
      На iPhone и iPad push-уведомления работают только в приложении,
      установленном на экран «Домой»: <br />
      1. Откройте платформу в Safari. <br />
      2. Нажмите «Поделиться» и выберите «На экран „Домой“». <br />
      3. Откройте платформу с экрана «Домой» и включите уведомления здесь.
    </info-block>
  </div>
  <div
    class="push-notifications-form__unsupported"
    v-else-if="!supported"
  >
    <warning-block>
      Ваш браузер не поддерживает push-уведомления.
    </warning-block>
  </div>
  <div
    class="push-notifications-form__denied"
    v-else-if="permission === 'denied'"
  >
    <warning-block>
      Уведомления для этого сайта заблокированы в браузере. <br />
      Чтобы включить их, разрешите уведомления в настройках сайта (значок слева
      от адресной строки) и обновите страницу.
    </warning-block>
  </div>
  <div
    class="push-notifications-form"
    v-else-if="!loading"
  >
    <p class="push-notifications-form__hint">
      Уведомления будут приходить в этот браузер, даже если вкладка с
      платформой закрыта. Настройка действует только для текущего устройства.
    </p>
    <form-toggle
      :key="`${enabled}-${toggleCount}`"
      v-model="enabledModel"
      :values="[
        { value: false, label: 'Push-уведомления выключены' },
        { value: true, label: 'Push-уведомления включены' }
      ]"
    />
  </div>
  <div
    class="push-notifications-form__loading"
    v-else
  >
    <loader-icon contrast />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  supported: boolean
  needsInstall?: boolean
  permission: NotificationPermission
  enabled: boolean
  loading?: boolean
}

interface Emits {
  (e: 'toggled', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

// form-toggle keeps its own state, so it is re-mounted on every toggle
// to always reflect the actual value (e.g. when enabling failed)
const toggleCount = ref(0)

const enabledModel = computed({
  get: () => props.enabled,
  set: (value) => {
    toggleCount.value++
    emits('toggled', value)
  }
})
</script>

<style lang="sass" scoped>
.push-notifications-form
	color: var(--text-light)

	&__hint
		margin-top: 0

	&__loading
		font-size: 2em
</style>
