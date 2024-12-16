<template>
  <div
    class="student-mentors-action"
    v-for="action in currentActions"
    :key="action.label"
    @click="action.action()"
  >
    <div
      class="student-mentors-action__icon"
      :key="action.icon"
    >
      <inline-icon :name="action.icon" />
    </div>
    <div class="student-mentors-action__label">
      <span>{{ action.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IconName } from '@/components/decorations/inline-icon.vue'
import { Core } from '@/core/Core'
import type { User } from '@/core/data/entities/User'
import { computed, reactive } from 'vue'

interface Action {
  label: string
  icon: IconName
  action: () => void
  roles: User['role'][]
  visible: (mentorId: User['id'] | null) => boolean
}

interface Props {
  mentorId: User['id'] | null
}

interface Emits {
  (event: 'assign-mentor'): void
  (event: 'assign-me-student'): void
  (event: 'remove-mentor'): void
  (event: 'change-mentor'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const actions = reactive<Action[]>([
  {
    label: 'Назначить куратора',
    icon: 'add',
    action: () => emits('assign-mentor'),
    roles: ['admin', 'teacher', 'assistant'],
    visible: (id) => !id
  },
  {
    label: 'Сменить куратора',
    icon: 'edit',
    action: () => emits('assign-mentor'),
    roles: ['admin', 'teacher', 'assistant'],
    visible: (id) => !!id
  },
  {
    label: 'Открепить куратора',
    icon: 'cross-red',
    action: () => emits('remove-mentor'),
    roles: ['admin', 'teacher', 'assistant'],
    visible: (id) => !!id
  },
  {
    label: 'Стать куратором',
    icon: 'add',
    action: () => emits('assign-me-student'),
    roles: ['mentor'],
    visible: (id) => id !== Core.Context.User!.id
  },
  {
    label: 'Перестать быть куратором',
    icon: 'cross-red',
    action: () => emits('remove-mentor'),
    roles: ['mentor'],
    visible: (id) => id === Core.Context.User!.id
  }
])

const currentActions = computed(() =>
  actions.filter((action) => {
    const user = Core.Context.User
    return action.roles.includes(user!.role) && action.visible(props.mentorId)
  })
)
</script>

<style lang="sass" scoped>
.student-mentors-action
	margin-top: 0.3em
	cursor: pointer
	display: flex
	align-items: center
	gap: 0.2em
	font-size: 0.9em
	line-height: 0.95em

	&:hover
		color: var(--text-light)
</style>
