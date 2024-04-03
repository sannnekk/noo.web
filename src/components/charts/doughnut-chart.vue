<template>
  <vue3-chart-js v-bind="doughnutChart" />
</template>

<script setup lang="ts">
// @ts-ignore
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import { computed } from 'vue'

interface Props {
  data: {
    label: string
    color: string
    value: number
  }[]
}

const props = defineProps<Props>()

const doughnutChart = computed(() => ({
  type: 'doughnut',
  data: {
    labels: props.data.map((d) => d.label),
    datasets: [
      {
        backgroundColor: props.data.map((d) => d.color),
        data: props.data.map((d) => d.value)
      }
    ]
  }
}))
</script>

<style scoped></style>
