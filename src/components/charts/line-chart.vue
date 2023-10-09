<template>
  <vue3-chart-js v-bind="lineChart" />
</template>

<script setup lang="ts">
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import { computed } from 'vue'

interface Props {
  data: {
    label: string
    color: string
    values: number[]
  }[]
  labels: string[]
}

const props = defineProps<Props>()

const lineChart = computed(() => ({
  type: 'line',
  data: {
    labels: props.labels,
    datasets: props.data.map((d) => ({
      label: d.label,
      backgroundColor: d.color,
      borderColor: d.color,
      data: d.values
    }))
  }
}))
</script>

<style scoped></style>
