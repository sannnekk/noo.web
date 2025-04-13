<template>
  <vue3-chart-js
    v-if="plot"
    v-bind="lineChart"
  />
</template>

<script setup lang="ts">
import type { Plot } from '@/core/data/Statistics'
// @ts-ignore
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import { computed } from 'vue'

interface Props {
  plot: Plot
}

const props = defineProps<Props>()

const lineChart = computed(() => ({
  type: 'line',
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  },
  data: {
    labels: props.plot.data.map((p) => p.key),
    datasets: [
      {
        label: false,
        backgroundColor: 'black',
        borderColor: resolveColorVar(props.plot.color),
        data: props.plot.data.map((d) => d.value),
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0.4
      }
    ]
  }
}))

// function to get the value of a CSS color variable
function resolveColorVar(color: string): string {
  return getComputedStyle(document.body).getPropertyValue(`--${color}`)
}
</script>
