<template>
  <router-link
    to="/profile"
    class="profile-widget"
  >
    <div class="profile-widget__avatar">
      <user-avatar
        :src="Core.Context.User?.avatar?.src"
        :name="Core.Context.User?.name"
      />
    </div>
    <div class="profile-widget__credentials">
      <h3 class="profile-widget__credentials__name">
        {{ Core.Context.User?.name }}
      </h3>
      <div class="profile-widget__credentials__actions">
        <span class="profile-widget__credentials__actions__username">
          {{ Core.Context.User?.username }}
        </span>
        <div class="profile-widget__credentials__actions__separator">
          &bullet;
        </div>
        <logout-button />
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
</script>

<style scoped lang="sass">
.profile-widget
  display: flex
  align-items: center
  text-decoration: none
  color: unset
  padding: 10px
  border-radius: var(--border-radius)

  @media screen and (max-width: 768px)
    padding: 0

  &:hover
    background-color: var(--light-background-color)

  &__avatar
    font-size: 50px
    margin-right: 10px

    @media screen and (max-width: 768px)
      font-size: 40px

  &__credentials
    @media screen and (max-width: 768px)
      font-size: 12px

    &__name
      margin: 0
      padding: 0

    &__actions
      display: flex
      align-items: center
      font-size: 12px

      &__separator
        margin: 0 -5px 0 7px
        font-size: 20px
        line-height: 12px
</style>
