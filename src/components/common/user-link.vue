<template>
  <span
    @click="openUserModal"
    class="user-link"
  >
    {{ name || username }}
  </span>
  <user-info-modal
    v-if="user"
    v-model:visible="isModalOpen"
    :user="user"
  />
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { User } from '@/core/data/entities/User'
import { ref } from 'vue'

interface Props {
  username: string
  name?: string
}

const props = defineProps<Props>()

const isModalOpen = ref(false)
const user = ref<User | null>()

async function openUserModal() {
  Core.Services.UI.setLoading(true)

  try {
    const response = await Core.Services.User.getUser(props.username)
    user.value = response.data
    isModalOpen.value = true
  } catch (error: any) {
    Core.Services.UI.openErrorModal(
      'Ошибка при получении пользователя',
      error.message
    )
  } finally {
    Core.Services.UI.setLoading(false)
  }
}
</script>

<style scoped lang="sass">
.user-link
  color: var(--lila)
  font-weight: 500
  cursor: pointer

  &:hover
    text-decoration: underline
</style>
