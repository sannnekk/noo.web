<template>
  <draggable-list
    v-model="chaptersModel"
    item-key="slug"
    :handle="`.handle-chapters`"
    group="chapters"
  >
    <template v-slot="chapter">
      <div class="chapter-tree__item">
        <div class="chapter-tree__item__title">
          <span class="chapter-tree__item__title__text">
            <span class="chapter-tree__item__title__dragger handle-chapters">
              ::
            </span>
            &nbsp;
            <b :style="{ color: chapter.item.titleColor }">
              <inline-icon
                v-if="chapter.item.isPinned"
                class="chapter-tree__item__title__pin"
                name="pin"
              />
              {{ chapter.item.name }}
            </b>
          </span>
          <div class="chapter-tree__item__title__actions">
            <div
              class="chapter-tree__item__title__is-active"
              title="Активировать/деактивировать главу"
            >
              <inline-icon
                :key="chapter.item.isActive"
                :name="chapter.item.isActive ? 'check-green' : 'cross-red'"
                :title="
                  chapter.item.isActive ? 'Глава активна' : 'Глава не активна'
                "
                @click="onToggleChapterIsActive(chapter.item)"
              />
            </div>
            <div
              class="chapter-tree__item__title__edit"
              @click="onChapterCopy(chapter.item)"
              title="Копировать главу"
            >
              <inline-icon name="copy" />
            </div>
            <div
              class="chapter-tree__item__title__edit"
              @click="onChapterNameChange(chapter.item.slug, chapter.item.name)"
              title="Изменить название главы"
            >
              <inline-icon name="edit" />
            </div>
            <span
              class="chapter-tree__item__title__remove"
              title="Удалить главу"
            >
              <inline-icon
                name="delete"
                @click="onChapterRemove(chapter.item.slug)"
              />
            </span>
          </div>
        </div>
        <div
          class="chapter-tree__item__chapters"
          v-if="chapter.item.chapters?.length"
        >
          <chapter-tree
            :all-chapters="props.allChapters"
            v-model:chapters="chapter.item.chapters"
            :course-slug="courseSlug"
            :nesting-level="(props.nestingLevel || 0) + 1"
          />
        </div>
        <ul class="chapter-tree__item__materials">
          <draggable-list
            v-model="chapter.item.materials"
            item-key="slug"
            :handle="`.handle-materials`"
            group="materials"
          >
            <template v-slot="{ item }">
              <li class="chapter-tree__item__materials__item">
                <span
                  class="chapter-tree__item__materials__item__dragger handle-materials"
                >
                  ::
                </span>
                <div class="chapter-tree__item__materials__item__title">
                  <router-link
                    :to="`/create-course${courseSlug || ''}/${
                      chapter.item.slug
                    }--${item.slug}`"
                  >
                    {{ item.name }}
                  </router-link>
                </div>
                <span class="chapter-tree__item__materials__item__is-active">
                  <inline-icon
                    :key="item.isActive"
                    :name="item.isActive ? 'check-green' : 'cross-red'"
                    :title="
                      item.isActive ? 'Материал активен' : 'Материал не активен'
                    "
                    @click="item.isActive = !(item.isActive || false)"
                  />
                </span>
                <span class="chapter-tree__item__materials__item__remove">
                  <inline-icon
                    name="delete"
                    @click="onMaterialRemove(chapter.item.slug, item.slug)"
                    title="Удалить материал"
                  />
                </span>
              </li>
            </template>
          </draggable-list>
          <li v-if="!nestingLevel">
            <span @click="addChapter(chapter.item.slug)">
              <span class="chapter-tree__item__materials__add">
                <inline-icon name="add" />
                Добавить главу
              </span>
            </span>
          </li>
          <li>
            <span @click="addMaterial(chapter.item.slug)">
              <span class="chapter-tree__item__materials__add">
                <inline-icon name="add" />
                Добавить материал
              </span>
            </span>
          </li>
        </ul>
      </div>
    </template>
  </draggable-list>
  <div
    class="chapter-tree__add-chapter"
    v-if="!props.nestingLevel"
  >
    <common-button
      design="inline"
      alignment="stretch"
      @click="addChapter()"
    >
      Добавить главу
    </common-button>
  </div>
  <sure-modal
    v-model:visible="sureModalData.visible"
    @confirm="sureModalData.action"
  >
    <template #title>{{ sureModalData.title }}</template>
    <template #text>
      <div class="sure-modal-container">
        <p>{{ sureModalData.text }}</p>
        <form-input
          v-if="sureModalData.inputLabel"
          v-model="sureModalData.input"
          type="text"
          :label="sureModalData.inputLabel"
        />
        <select-input
          v-if="sureModalData.colorInput"
          type="color"
          v-model="sureModalData.color!"
          label="Цвет заголовка"
          :options="[
          { label: 'Без цвета', value: null as any },
          { label: 'Основной зеленый', value: 'var(--primary)' },
          { label: 'Основной фиолетовый', value: 'var(--lila)' },
          { label: 'Красный', value: 'var(--danger)' },
          { label: 'Желтый', value: 'var(--warning)' }
        ]"
        />
        <form-checkbox
          v-model="sureModalData.isPinned"
          label="Закрепить главу"
        />
      </div>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import type { Chapter } from '@/core/data/entities/Chapter'
import type { Material } from '@/core/data/entities/Material'
import { entityFactory } from '@/core/utils/entityFactory'
import { computed, reactive } from 'vue'
import { findChapter, findParent } from '../utils/helpers'

interface Props {
  allChapters: Chapter[]
  chapters: Chapter[]
  courseSlug?: string
  nestingLevel?: number
}

interface Emits {
  (e: 'update:chapters', value: Chapter[]): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const chaptersModel = computed({
  get: () => props.chapters,
  set: (value: Chapter[]) => emits('update:chapters', value)
})

const sureModalData = reactive({
  visible: false,
  title: '',
  text: '',
  input: '',
  colorInput: false,
  color: null as null | string,
  pinnedInput: false,
  isPinned: false,
  inputLabel: '',
  action: () => {}
})

// handlers
function onChapterNameChange(chapterSlug: string, currentName: string) {
  const chapter = findChapter(props.chapters, chapterSlug)

  sureModalData.title = 'Изменение названия главы'
  sureModalData.text = ''
  sureModalData.inputLabel = 'Введите новое название главы'
  sureModalData.input = currentName
  sureModalData.colorInput = true
  sureModalData.color = chapter?.titleColor ?? null
  sureModalData.pinnedInput = true
  sureModalData.isPinned = chapter?.isPinned ?? false
  sureModalData.visible = true
  sureModalData.action = () => {
    if (!sureModalData.input) return

    changeChapter(
      chapterSlug,
      sureModalData.input,
      sureModalData.color,
      sureModalData.isPinned
    )
  }
}

function onChapterRemove(chapterSlug: string) {
  sureModalData.title = 'Удаление главы'
  sureModalData.text = 'Вы уверены, что хотите удалить главу?'
  sureModalData.visible = true
  sureModalData.inputLabel = ''
  sureModalData.colorInput = false
  sureModalData.pinnedInput = false
  sureModalData.action = () => {
    removeChapter(chapterSlug)
  }
}

function onMaterialRemove(chapterSlug: string, materialSlug: string) {
  sureModalData.title = 'Удаление материала'
  sureModalData.text = 'Вы уверены, что хотите удалить материал?'
  sureModalData.visible = true
  sureModalData.inputLabel = ''
  sureModalData.colorInput = false
  sureModalData.pinnedInput = false
  sureModalData.action = () => {
    removeMaterial(chapterSlug, materialSlug)
  }
}

function onToggleChapterIsActive(chapter: Chapter) {
  chapter.isActive = !(chapter.isActive || false)

  for (const material of chapter.materials || []) {
    material.isActive = chapter.isActive
  }
}

function onChapterCopy(chapter: Chapter) {
  const newChapter = entityFactory<Chapter>('chapter')
  newChapter.name = `${chapter.name} (копия)`
  newChapter.isActive = chapter.isActive
  newChapter.order = chapter.order

  newChapter.materials = chapter.materials?.map((material) => {
    const newMaterial = entityFactory<Material>('material')
    newMaterial.name = `${material.name} (копия)`
    newMaterial.isActive = material.isActive
    newMaterial.order = material.order
    newMaterial.content = material.content
    newMaterial.description = material.description
    return newMaterial
  })

  newChapter.chapters = chapter.chapters?.map((c) => {
    const newChapter = entityFactory<Chapter>('chapter')
    newChapter.name = `${c.name} (копия)`
    newChapter.isActive = c.isActive
    return newChapter
  })

  const parent = findParent(props.allChapters, chapter.slug)

  if (parent) {
    parent.chapters = [...(parent.chapters || []), newChapter]
  } else {
    chaptersModel.value = [...props.chapters, newChapter]
  }
}

// actions
function removeChapter(chapterSlug: string) {
  const parent = findParent(props.allChapters, chapterSlug)

  if (parent) {
    parent.chapters = parent.chapters?.filter((c) => c.slug !== chapterSlug)
  } else {
    chaptersModel.value = props.chapters.filter((c) => c.slug !== chapterSlug)
  }
}

function changeChapter(
  chapterSlug: string,
  newName: string,
  newColor: string | null,
  isPinned: boolean
) {
  const chapter = findChapter(props.chapters, chapterSlug)

  if (chapter) {
    chapter.name = newName
    chapter.titleColor = newColor
    chapter.isPinned = isPinned
  }
}

function removeMaterial(chapterSlug: string, materialSlug: string) {
  const chapter = findChapter(props.chapters, chapterSlug)

  if (chapter) {
    chapter.materials = chapter.materials?.filter(
      (material) => material.slug !== materialSlug
    )
  }
}

function addMaterial(chapterSlug: string) {
  const newMaterial = entityFactory<Material>('material')
  newMaterial.name = 'Новый материал'

  const chapter = findChapter(props.chapters, chapterSlug)

  if (chapter) {
    chapter.materials = [...(chapter.materials || []), newMaterial]
  }
}

function addChapter(parentSlug?: string) {
  const newChapter = entityFactory<Chapter>('chapter')
  newChapter.name = 'Новая глава'

  if (parentSlug) {
    const parentChapter = findChapter(props.chapters, parentSlug)

    if (parentChapter) {
      parentChapter.chapters = [...(parentChapter.chapters || []), newChapter]
    }
  } else {
    chaptersModel.value = [...props.chapters, newChapter]
  }
}
</script>

<style lang="sass" scoped>
.sure-modal-container
  display: flex
  flex-direction: column
  gap: 0.7em

.chapter-tree
  padding: 0
  list-style: none

  a
    color: var(--form-text-color)
    text-decoration: none

  &__item
    margin-bottom: 0.5em
    border: 1px solid var(--border-color)
    border-radius: var(--border-radius)
    padding: 1em

    &__title
      display: flex
      flex-direction: column
      font-size: 1em
      font-weight: bold
      gap: 0.5em

      &__pin
        position: relative
        top: 2px

      &__actions
        display: flex
        gap: 0.5em
        justify-content: flex-end

      &__dragger
        cursor: move
        display: inline-block
        user-select: none

      &__text
        flex: 1
        font-size: 0.8em

      &__is-active
        cursor: pointer

      &__edit
        cursor: pointer
        transition: transform 0.1s ease-in-out
        border-radius: var(--border-radius)
        font-size: 0.9em

        &:hover
          *
            --form-text-color: var(--lila)

      &__remove
        cursor: pointer
        display: block
        text-align: center
        transition: transform 0.1s ease-in-out
        font-size: 0.9em

        &:hover
          *
            --danger: var(--form-text-color)

    &__materials
      padding: 0
      list-style: none
      font-size: 0.7em

      &__item
        margin-bottom: 0.5em
        border: 1px solid var(--border-color)
        border-radius: var(--border-radius)
        display: flex
        flex-direction: row
        justify-content: space-between
        align-items: center

        &__dragger
          cursor: move
          display: inline-block
          user-select: none
          width: 1.7em
          text-align: center
          font-weight: bold

        &__title
          flex: 1
          a
            font-weight: normal
            color: var(--form-text-color)
            text-decoration: none
            display: block
            width: 100%
            height: 100%
            padding: 0.5em 0.5em

            &.router-link-active
              font-weight: bold

            &:hover
              background-color: var(--border-color)

        &__is-active
          cursor: pointer
          font-size: 1.2em
          padding-top: 0.2em
          padding-right: 0.2em
          padding-left: 0.4em

        &__remove
          cursor: pointer
          font-size: 1.2em
          padding-top: 0.2em
          padding-right: 0.4em
          padding-left: 0.2em

          &:hover
            *
              --danger: var(--form-text-color)

      &__add
        color: var(--text-light)
        cursor: pointer
        display: flex
        align-items: center
        gap: 0.4em

        &:hover
          text-decoration: underline

  &__add-chapter
    font-size: 0.7em
    width: 70%
    margin-left: 15%
    margin-bottom: 1em
</style>
