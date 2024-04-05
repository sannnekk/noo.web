<template>
  <div
    class="statistics-view"
    v-if="Core.Context.User?.role !== 'admin'"
    v-auto-animate
  >
    <div class="statistics-view__header">
      <div class="row">
        <div class="col-md-4 col-12">
          <form-input
            type="date"
            v-model="statisticsBoundaries.from"
            label="Начало статистики"
          />
        </div>
        <div class="col-md-4 col-12">
          <form-input
            type="date"
            v-model="statisticsBoundaries.to"
            label="Конец статистики"
          />
        </div>
        <div class="col-md-4 col-12">
          <select-input
            label="Тип работы"
            :options="[
              { label: 'Все', value: undefined },
              { label: 'Мини-зачет', value: 'mini-test' },
              { label: 'Тест', value: 'test' },
              { label: 'Вторая часть', value: 'second-part' },
              { label: 'Фраза', value: 'phrase' },
              { label: 'Пробник', value: 'trial-work' }
            ]"
            v-model="statisticsBoundaries.type"
          />
        </div>
      </div>
    </div>
    <div
      class="statistics-view__content"
      v-if="statistics && !isLoading"
    >
      <div class="statistics-view__content__plots">
        <div
          class="statistics-view__content__plots_plot"
          v-for="plot in statistics.plots"
          :key="plot.name"
        >
          <statistics-plot-card :plot="plot" />
        </div>
      </div>
      <div class="statistics-view__content__entries">
        <div class="row">
          <div
            class="col-12 col-md-4 col-lg-3"
            v-for="entry in statistics.entries"
            :key="entry.name"
          >
            <statistics-number-card
              :name="entry.name"
              :value="entry.value"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="statistics-view__content--loading"
      v-else-if="isLoading"
    >
      <loader-icon contrast />
    </div>
    <div
      class="statistics-view__content--not-loaded"
      v-else
    >
      <error-block>
        Произошла ошибка при получении статистики пользователя
      </error-block>
    </div>
  </div>
  <div class="statistics-view__admin">
    <p>Нет статистики для администраторов</p>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import { reactive, ref, watch } from 'vue'
import type { Statistics } from '@/core/data/Statistics'
import { debounce } from '@/core/utils/debounce'
import type { Work } from '@/core/data/entities/Work'

interface Props {
  username: string
}

const props = defineProps<Props>()

const statisticsService = Core.Services.Statistics
const uiService = Core.Services.UI

const isLoading = ref(true)
const statistics = ref<Statistics>()
const statisticsBoundaries = reactive({
  from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
  to: new Date(),
  type: undefined as Work['type'] | undefined
})

watch(statisticsBoundaries, debounce(fetchUserStatistics, 500), {
  deep: true,
  immediate: true
})

watch(
  statisticsBoundaries,
  () => {
    isLoading.value = true
  },
  {
    deep: true,
    immediate: true
  }
)

async function fetchUserStatistics() {
  try {
    const response = await statisticsService.getStatistics(
      props.username,
      statisticsBoundaries.to,
      statisticsBoundaries.from,
      statisticsBoundaries.type
    )

    statistics.value = response.data as Statistics
  } catch (error: any) {
    uiService.openErrorModal(
      'Произошла ошибка при получении статистики пользователя',
      error.message
    )
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="sass">
.statistics-view
  &__header
    margin-bottom: 1em

  &__content

    &__plots
      margin: 1em 0

    &__entries
      margin: 1em 0

  &__content--loading
    display: flex
    justify-content: center
    align-items: center
    padding: 3em 0
    font-size: 40px

  &__content--not-loaded
    display: flex
    justify-content: center
    align-items: center
    height: 100px
    max-width: 90%
    text-align: center
</style>
