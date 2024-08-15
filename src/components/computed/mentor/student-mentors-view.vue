<template>
  <div class="student-mentors-view__header">
    <h3>Кураторы</h3>
  </div>
  <div
    class="student-mentors-view"
    v-if="subjectsToSHow.length > 0"
  >
    <div class="row">
      <div
        class="col-md-6"
        v-for="subject in subjectsToSHow"
        :key="subject.id"
      >
        <div class="student-mentors-view__card">
          <div class="student-mentors-view__card__subject">
            <subject-name :subject="subject" />
          </div>
          <div class="student-mentors-view__card__mentor">
            <div
              class="student-mentors-view__card__mentor__current"
              v-if="subject.assignment?.mentor"
            >
              <div class="student-mentors-view__card__mentor__card">
                <user-card :user="subject.assignment.mentor" />
              </div>
              <span
                class="student-mentors-view__card__mentor__assign-button"
                v-if="Core.Context.roleIs(['admin', 'teacher'])"
                @click="
                  openAssignMentorModal(
                    subject,
                    subject.assignment?.mentor || null,
                    subject.assignment?.student || null
                  )
                "
              >
                <inline-icon
                  name="edit"
                  class="student-mentors-view__card__mentor__assign-button__icon"
                />
                Сменить куратора
              </span>

              <div
                v-else-if="Core.Context.roleIs(['mentor']) && 
								(subject.assignment!.mentor.id !== Core.Context.User!.id)"
                design="secondary"
                class="student-mentors-view__card__mentor__assign-button"
                @click="assignMeStudent(subject)"
              >
                <span>
                  <inline-icon
                    name="add"
                    class="student-mentors-view__card__mentor__assign-button__icon"
                  />
                  Стать куратором
                </span>
              </div>
            </div>
            <div
              v-else-if="Core.Context.roleIs(['admin', 'teacher'])"
              design="secondary"
              class="student-mentors-view__card__mentor__assign-button"
              @click="openAssignMentorModal(subject, null, student)"
            >
              <span>
                <inline-icon
                  name="add"
                  class="student-mentors-view__card__mentor__assign-button__icon"
                />
                Назначить куратора
              </span>
            </div>
            <div
              v-else-if="
								Core.Context.roleIs(['mentor']) && 
								(subject.assignment!.mentor.id !== Core.Context.User!.id)
							"
              design="secondary"
              class="student-mentors-view__card__mentor__assign-button"
              @click="assignMeStudent(subject)"
            >
              <span>
                <inline-icon
                  name="add"
                  class="student-mentors-view__card__mentor__assign-button__icon"
                />
                Стать куратором
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="student-mentors-view__no-mentors"
    v-if="subjectsToSHow.length === 0"
  >
    <p>Кураторы пока не назначены</p>
  </div>
  <student-mentors-view-modal
    v-model:visible="assignMentorModalData.visibility"
    :subject="assignMentorModalData.subject!"
    :current-mentor="assignMentorModalData.currentMentor"
    :student="assignMentorModalData.student!"
    @mentor-assigned="$emit('mentor-assigned')"
  />
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { MentorAssignment } from '@/core/data/entities/MentorAssignment'
import type { Subject } from '@/core/data/entities/Subject'
import type { User } from '@/core/data/entities/User'
import { computed, onMounted, reactive, ref } from 'vue'

interface SubjectToShow extends Subject {
  assignment: MentorAssignment | null
}

interface Props {
  student: User
  mentorAssignments: MentorAssignment[]
}

interface Emits {
  (e: 'mentor-assigned'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const userService = Core.Services.User
const subjectService = Core.Services.Subject
const uiService = Core.Services.UI

const subjects = ref<Subject[]>([])
const assignMentorModalVisible = ref(false)

const assignMentorModalData = reactive({
  visibility: assignMentorModalVisible,
  subject: null as Subject | null,
  currentMentor: null as MentorAssignment['mentor'] | null,
  student: null as MentorAssignment['student'] | null
})

const subjectsToSHow = computed<SubjectToShow[]>(() => {
  return subjects.value
    .map((subject) => ({
      ...subject,
      assignment:
        props.mentorAssignments.find((assignment) => {
          return assignment.subject.id === subject.id
        }) || null
    }))
    .filter(
      (subject) =>
        Core.Context.roleIs(['admin', 'teacher', 'mentor']) ||
        subject.assignment
    )
})

function openAssignMentorModal(
  subject: Subject | null,
  currentMentor: MentorAssignment['mentor'] | null,
  student: MentorAssignment['student'] | null
) {
  if (Core.Context.roleIs(['student'])) {
    return
  }

  if (!subject || !student) {
    return
  }

  assignMentorModalData.subject = subject
  assignMentorModalData.currentMentor = currentMentor
  assignMentorModalData.student = student

  assignMentorModalVisible.value = true
}

async function assignMeStudent(subject: Subject) {
  try {
    await userService.assignMentor(
      props.student.id,
      Core.Context.User!.id,
      subject.id,
      { showLoader: true }
    )
    emits('mentor-assigned')
  } catch (error: any) {
    uiService.openErrorModal('Не удалось назначить куратора', error.message)
  }
}

onMounted(async () => {
  subjects.value = (await subjectService.getSubjects()).data
})
</script>

<style scoped lang="sass">
.student-mentors-view
	&__header
		padding-top: 1em

	&__card
		margin-bottom: 1em
		padding: 1em
		border: 1px solid var(--border-color)
		border-radius: var(--border-radius)

		&__subject
			margin-bottom: 1em

		&__mentor

			&__card
				margin-bottom: 1em

				> *
					border: none
					padding: 0.2em

			&__assign-button
				margin-top: 1em
				cursor: pointer

				&:hover
					color: var(--text-light)

				&__icon
					position: relative
					top: 0.15em

	&__no-mentors
		p
			color: var(--text-light)
</style>
