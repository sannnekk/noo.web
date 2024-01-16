<template>
  <div class="transfer-work-view">
    <div class="transfer-work-view__header">
      <p class="transfer-work-view__header__description">
        Выберите куратора, которому хотите передать работу "<b>{{
          transferWorkStore.work?.work?.name
        }}</b
        >" ученика <b>{{ transferWorkStore.work?.student?.name }}</b>
      </p>
    </div>
    <div class="transfer-work-view__body">
      <div class="transfer-work-view__body__search">
        <search-field v-model="transferWorkStore.search" />
      </div>
      <div class="transfer-work-view__body__table">
        <check-list
          :items="transferWorkStore.mentors"
          item-label-key="name"
          item-key="id"
          v-model="transferWorkStore.selectedMentorId"
        />
      </div>
      <div
        class="transfer-work-view__body__confirm"
        v-auto-animate
      >
        <common-button
          @click="transferWorkStore.transfer()"
          alignment="right"
          v-if="transferWorkStore.selectedMentorId"
        >
          Передать работу
        </common-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTransferWorkStore } from '../stores/useTransferWorkStore'

const transferWorkStore = useTransferWorkStore()
</script>

<style scoped lang="sass">
.transfer-work-view
  display: flex
  flex-direction: column
  width: 100%
  height: 100%

  &__header
    padding: 1em
    border-bottom: 1px solid var(--border-color)

    &__description
      margin: 0
      font-size: 14px
      font-weight: 500
      color: var(--text-light)

  &__body
    flex: 1
    padding: 1em
    display: flex
    flex-direction: column

    &__table
      flex: 1
      padding: 16px
      overflow-y: auto
</style>
