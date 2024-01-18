<template>
  <div class="index-calender-view">
    <div class="index-calender-view__calender">
      <calender-datepicker
        v-model="calenderStore.currentDate"
        :day-function="calenderStore.dayFunction"
      />
    </div>
    <div class="index-calender-view__events">
      <calender-event-list
        :date="calenderStore.currentDate"
        :events="calenderStore.events"
        @remove="calenderStore.onEventRemove($event)"
      />
      <calender-event-form
        v-model="calenderStore.newEvent"
        @submit="calenderStore.onEventSubmit()"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import calenderEventList from '../components/calender-event-list.vue'
import calenderEventForm from '../components/calender-event-form.vue'
import { useCalenderStore } from '../stores/calender'

const calenderStore = useCalenderStore()
</script>

<style lang="sass" scoped>
.index-calender-view
  display: flex
  flex-direction: row
  height: 100%

  @media screen and (max-width: 768px)
    flex-direction: column

  &__calender
    max-width: 330px
    width: 100%
    padding: 1em

    @media screen and (max-width: 768px)
      max-width: 100%
      width: 100%

  &__events
    flex: 1
    padding: 1em

    @media screen and (max-width: 768px)
      max-width: 100%
      width: 100%
</style>
