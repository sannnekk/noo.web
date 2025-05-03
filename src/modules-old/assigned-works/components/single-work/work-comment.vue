<template>
  <div class="work-comment">
    <div class="work-comment__student">
      <h4>Передать привет куратору:</h4>
      <rich-text-area
        label="Здесь Вы можете оставить комментарий к работе. Он будет виден куратору"
        v-if="mode === 'solve'"
        v-model="studentCommentModel"
      />
      <rich-text-container
        class="work-comment__student__container"
        v-else
        :content="commentValue(studentComment)"
      />
    </div>
    <div class="work-comment__mentor">
      <h4>Комментарий куратора:</h4>
      <rich-text-area
        label="Комментарий куратора к работе. Он будет виден Вам и ученику"
        v-if="mode === 'check'"
        v-model="mentorCommentModel"
      />
      <rich-text-container
        class="work-comment__mentor__container"
        v-else
        :content="commentValue(mentorComment)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import { emptyDelta, isDeltaEmptyOrWhitespace } from '@/core/utils/deltaHelpers'
import type { DeltaContentType } from '@/types/richtext/DeltaContentType'
import { computed } from 'vue'

interface Props {
  mode: 'solve' | 'check' | 'read'
  studentComment: AssignedWork['studentComment']
  mentorComment: AssignedWork['mentorComment']
}

interface Emits {
  (event: 'update:studentComment', value: AssignedWork['studentComment']): void
  (event: 'update:mentorComment', value: AssignedWork['mentorComment']): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const studentCommentModel = computed({
  get: () => props.studentComment || emptyDelta(),
  set: (value: AssignedWork['studentComment']) =>
    emits('update:studentComment', value)
})

const mentorCommentModel = computed({
  get: () => props.mentorComment || emptyDelta(),
  set: (value: AssignedWork['mentorComment']) =>
    emits('update:mentorComment', value)
})

function commentValue(comment: DeltaContentType | null) {
  if (comment && !isDeltaEmptyOrWhitespace(comment)) {
    return comment
  }

  return {
    ops: [{ insert: '-' }]
  }
}
</script>

<style scoped lang="sass">
.work-comment
	h4
		font-weight: 500

	&__student,
	&__mentor
		&__container
			:deep()
				.quill-editor__content
					padding: 0
</style>
