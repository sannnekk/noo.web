<template>
  <div class="nootube-select-input">
    <div class="nootube-select-input__selected-list">
      <p
        class="nootube-select-input__selected-list__empty"
        v-if="!model.length"
      >
        Нет выбранных видео
      </p>
      <draggable-list
        v-model="model"
        item-key="id"
      >
        <template v-slot="{ item }">
          <div class="nootube-select-input__selected-list__item">
            <video-card
              :video="item"
              small
              selectable
              is-selected
              @select="unselect(item.id)"
            />
          </div>
        </template>
      </draggable-list>
    </div>
    <div class="nootube-select-input__actions">
      <common-button
        design="secondary"
        alignment="left"
        @click="emptySelected()"
      >
        Удалить все
      </common-button>
      <common-button
        design="primary"
        alignment="left"
        @click="openModal()"
      >
        {{ model.length ? 'Добавить еще' : 'Добавить видео' }}
      </common-button>
    </div>
  </div>
  <sure-modal v-model:visible="isModalVisible">
    <template #title>Выберите видео</template>
    <template #text>
      <div class="nootube-select-input__modal">
        <div class="nootube-select-input__modal__search">
          <search-field
            v-model="videoSearch.pagination.value.search"
            :is-loading="videoSearch.isListLoading.value"
          />
        </div>
        <div class="nootube-select-input__modal__results">
          <video-list
            :videos="videoSearch.results.value"
            :is-loading="videoSearch.isListLoading.value"
            :is-selected="(video) => model.some((item) => item.id === video.id)"
            @select="onToggleSelect($event)"
            small
            selectable
          />
        </div>
        <div class="nootube-select-input__modal__pagination">
          <list-pagination
            v-model:page="videoSearch.pagination.value.page"
            :total="videoSearch.resultsMeta.value.total"
            :limit="videoSearch.pagination.value.limit"
          />
        </div>
      </div>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Video } from '@/core/data/entities/Video'
import { computed, ref } from 'vue'

interface Props {
  maxCount: number
  modelValue: Video[]
}

interface Emits {
  (event: 'update:modelValue', value: Video[]): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const videoService = Core.Services.Video

const model = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})

const isModalVisible = ref(false)

const videoSearch = useSearch(fetchVideos, { immediate: false })

function openModal() {
  isModalVisible.value = true
  videoSearch.trigger()
}

function emptySelected() {
  model.value = []
}

function onToggleSelect(video: Video) {
  if (model.value.length >= props.maxCount) {
    return
  }

  const isSelected = model.value.some((item) => item.id === video.id)

  if (isSelected) {
    unselect(video.id)
  } else {
    model.value = [...model.value, video]
  }
}

function unselect(id: Video['id']) {
  model.value = model.value.filter((video) => video.id !== id)
}

async function fetchVideos(pagination?: Pagination) {
  try {
    return await videoService.getVideos(pagination)
  } catch (error: any) {
    return
  }
}
</script>

<style scoped lang="sass">
.nootube-select-input
	&__selected-list
		padding-bottom: 1em

		&__item
			margin-bottom: 1em

	&__actions
		display: flex
		justify-content: flex-start
		gap: 1em

		> *
			display: block
			width: unset

	&__modal
		display: flex
		flex-direction: column
		gap: 1em

		&__results
			display: flex
			flex-direction: column
			gap: 1em

		&__pagination
			display: flex
			justify-content: center
</style>
