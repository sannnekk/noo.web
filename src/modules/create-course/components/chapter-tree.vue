<template>
  <draggable-list
    v-model="chaptersModel"
    item-key="name"
    :handle="`.handle-chapters`"
  >
    <template v-slot="chapter">
      <div class="chapter-tree__item">
        <div class="chapter-tree__item__title">
          <span class="chapter-tree__item__title__dragger handle-chapters">
            ::
          </span>
          <span class="chapter-tree__item__title__text">
            {{ chapter.item.name }}
          </span>
          <div class="chapter-tree__item__title__is-active">
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
          >
            <inline-icon name="copy" />
          </div>
          <div
            class="chapter-tree__item__title__edit"
            @click="onChapterNameChange(chapter.item.slug, chapter.item.name)"
          >
            <inline-icon name="edit" />
          </div>
          <span class="chapter-tree__item__title__remove">
            <inline-icon
              name="delete"
              @click="onChapterRemove(chapter.item.slug)"
            />
          </span>
        </div>
        <ul class="chapter-tree__item__materials">
          <draggable-list
            v-model="chapter.item.materials"
            item-key="name"
            :handle="`.handle-materials`"
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
                  />
                </span>
              </li>
            </template>
          </draggable-list>
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
  <div class="chapter-tree__add-chapter">
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
      <p>{{ sureModalData.text }}</p>
      <form-input
        v-if="sureModalData.inputLabel"
        v-model="sureModalData.input"
        type="text"
        :label="sureModalData.inputLabel"
      />
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import type { Chapter } from '@/core/data/entities/Chapter'
import type { Material } from '@/core/data/entities/Material'
import { entityFactory } from '@/core/utils/entityFactory'
import { computed, reactive } from 'vue'

interface Props {
  chapters: Chapter[]
  courseSlug?: string
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
  inputLabel: '',
  action: () => {}
})

// handlers
function onChapterNameChange(chapterSlug: string, currentName: string) {
  sureModalData.title = 'Изменение названия главы'
  sureModalData.text = ''
  sureModalData.inputLabel = 'Введите новое название главы'
  sureModalData.input = currentName
  sureModalData.visible = true
  sureModalData.action = () => {
    if (!sureModalData.input) return

    changeChapterName(chapterSlug, sureModalData.input)
  }
}

function onChapterRemove(chapterSlug: string) {
  sureModalData.title = 'Удаление главы'
  sureModalData.text = 'Вы уверены, что хотите удалить главу?'
  sureModalData.visible = true
  sureModalData.inputLabel = ''
  sureModalData.action = () => {
    removeChapter(chapterSlug)
  }
}

function onMaterialRemove(chapterSlug: string, materialSlug: string) {
  sureModalData.title = 'Удаление материала'
  sureModalData.text = 'Вы уверены, что хотите удалить материал?'
  sureModalData.visible = true
  sureModalData.inputLabel = ''
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

  chaptersModel.value = [...props.chapters, newChapter]
}

// actions
function removeChapter(chapterSlug: string) {
  chaptersModel.value = props.chapters.filter(
    (chapter) => chapter.slug !== chapterSlug
  )
}

function changeChapterName(chapterSlug: string, newName: string) {
  chaptersModel.value = props.chapters.map((chapter) => {
    if (chapter.slug === chapterSlug) {
      return {
        ...chapter,
        name: newName
      }
    }

    return chapter
  })
}

function removeMaterial(chapterSlug: string, materialSlug: string) {
  chaptersModel.value = props.chapters.map((chapter) => {
    if (chapter.slug === chapterSlug) {
      return {
        ...chapter,
        materials: chapter.materials!.filter(
          (material) => material.slug !== materialSlug
        )
      }
    }

    return chapter
  })
}

function addMaterial(chapterSlug: string) {
  const newMaterial = entityFactory<Material>('material')
  newMaterial.name = 'Новый материал'

  chaptersModel.value = props.chapters.map((chapter) => {
    if (chapter.slug === chapterSlug) {
      return {
        ...chapter,
        materials: [...chapter.materials!, newMaterial]
      }
    }

    return chapter
  })
}

function addChapter() {
  const newChapter = entityFactory<Chapter>('chapter')
  newChapter.name = 'Новая глава'

  chaptersModel.value = [...props.chapters, newChapter]
}
</script>

<style lang="sass" scoped>
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
      align-items: center
      font-size: 1em
      font-weight: bold
      gap: 0.5em

      &__dragger
        cursor: move
        display: inline-block
        user-select: none

      &__text
        flex: 1

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
