<template>
  <div class="index-profile-view">
    <the-sidebar-layout>
      <template #sidebar>
        <div class="index-profile-view__user-info">
          <div class="index-profile-view__credentials">
            <profile-credentials v-model="userStore.user" />
          </div>
          <div class="index-profile-view__password-change">
            <profile-password-form v-model="userStore.passwordChange" />
          </div>
        </div>
      </template>
      <template #content>
        <div class="index-profile-view__charts">
          <div
            class="index-profile-view__charts__card index-profile-view__charts__card--wide"
          >
            <h3 class="index-profile-view__charts__title">Средний балл</h3>
            <div class="index-profile-view__charts__chart">
              <line-chart
                :data="profileStore.charts.workScoreGraph.data"
                :labels="profileStore.charts.workScoreGraph.labels"
              />
            </div>
          </div>
          <div class="index-profile-view__charts__card">
            <div class="index-profile-view__charts__huge-number">
              <h1>{{ profileStore.charts.worksMadeCount }}</h1>
              <p>работ сдано</p>
            </div>
          </div>
          <div class="index-profile-view__charts__card">
            <div class="index-profile-view__charts__huge-number">
              <h1>{{ profileStore.charts.madeBeforeDeadlineRate }}%</h1>
              <p>работ сдано в дедлайн</p>
            </div>
          </div>
          <div class="index-profile-view__charts__card">
            <div class="index-profile-view__charts__huge-number">
              <h1>{{ profileStore.charts.firstWorkScore }}</h1>
              <p>балл первой работы</p>
            </div>
          </div>
        </div>
      </template>
    </the-sidebar-layout>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store'
import ProfileCredentials from '../components/profile-credentials.vue'
import ProfilePasswordForm from '../components/profile-password-form.vue'
import { useProfileStore } from '../stores/profile'

const userStore = useUserStore()
const profileStore = useProfileStore()
</script>

<style lang="sass" scoped>
.index-profile-view
  &__credentials
    margin-bottom: 1em

  &__charts
    flex: 1
    display: flex
    flex-wrap: wrap
    gap: 1em

    &__huge-number
      h1
        font-size: 50px
        margin-bottom: 0
        margin-top: 0

      p
        margin-top: 0
        font-size: 15px
        font-weight: normal

    &__card
      margin-bottom: 2em
      width: 30%
      text-align: center

      &--wide
        width: 95%

        canvas
          margin-top: 1em
          width: 100%

    &__title
      text-align: center
      margin-bottom: 0
</style>
