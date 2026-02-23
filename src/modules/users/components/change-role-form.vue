<template>
  <div class="change-role-form">
    <h3>Изменение роли</h3>
    <div
      class="change-role-form__actions"
      v-if="available"
    >
      <common-button
        alignment="stretch"
        design="inline"
        @click="openChangeRoleModal('admin')"
        class="change-role-form__actions__button"
      >
        Администратор
      </common-button>
      <common-button
        alignment="stretch"
        design="inline"
        @click="openChangeRoleModal('teacher')"
        class="change-role-form__actions__button"
      >
        Преподаватель
      </common-button>
      <common-button
        alignment="stretch"
        design="inline"
        @click="openChangeRoleModal('mentor')"
        class="change-role-form__actions__button"
      >
        Куратор
      </common-button>
      <common-button
        alignment="stretch"
        design="inline"
        @click="openChangeRoleModal('assistant')"
        class="change-role-form__actions__button"
      >
        Ассистент
      </common-button>
    </div>
    <div
      class="change-role-form__not-available"
      v-if="!available"
    >
      <p>Изменение роли недоступно</p>
    </div>
  </div>
  <sure-modal
    v-model:visible="changeRoleModal.visible"
    @confirm="$emit('change-role', changeRoleModal.role)"
  >
    <template #title>Изменение роли</template>
    <template #text>
      <p>Вы уверены, что хотите изменить роль пользователя?</p>
      <danger-block v-if="changeRoleModal.role === 'admin'">
        Пользователь получит доступ ко всем функциям системы. <br />
        Это действие нельзя отменить. <br />
        Вы уверены, что хотите продолжить?
      </danger-block>
      <danger-block v-else-if="changeRoleModal.role === 'teacher'">
        Пользователь получит доступ к управлению курсами. <br />
        Это действие нельзя отменить. <br />
        Вы уверены, что хотите продолжить?
      </danger-block>
      <warning-block v-else-if="changeRoleModal.role === 'assistant'">
        Пользователь получит доступ к работам и пользователям. <br />
        Это действие нельзя отменить. <br />
        Вы уверены, что хотите продолжить?
      </warning-block>
      <warning-block v-else>
        Пользователь получит доступ к управлению учениками. <br />
        Это действие нельзя отменить. <br />
        Вы уверены, что хотите продолжить?
      </warning-block>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import type { User } from '@/core/data/entities/User'
import { reactive } from 'vue'

interface Props {
  available?: boolean
}

interface Emits {
  (event: 'change-role', value: User['role']): void
}

defineProps<Props>()
defineEmits<Emits>()

const changeRoleModal = reactive({
  visible: false,
  role: 'mentor' as User['role']
})

function openChangeRoleModal(role: User['role']) {
  changeRoleModal.role = role
  changeRoleModal.visible = true
}
</script>

<style scoped lang="sass">
.change-role-form
	padding: 1em
	padding-top: 0
	padding-bottom: 0

	&__actions
		display: flex
		gap: 1em

		@media (max-width: 1100px)
			flex-direction: column

	&__not-available
		p
			color: var(--text-light)
</style>
