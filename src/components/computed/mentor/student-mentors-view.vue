<template>
  <div
    class="student-mentors-view"
    v-if="subjectsToSHow.length > 0"
  >
    <div class="row">
      <div
        class="col-lg-6"
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
            </div>
            <student-mentors-action
              :mentor-id="subject.assignment?.mentor?.id || null"
              @assign-mentor="
                openAssignMentorModal(
                  subject,
                  subject.assignment?.mentor || null
                )
              "
              @assign-me-student="assignMeStudent(subject)"
              @remove-mentor="removeMentor(subject)"
            />
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
  currentMentor: MentorAssignment['mentor'] | null
) {
  if (Core.Context.roleIs(['student'])) {
    return
  }

  if (!subject) {
    return
  }

  assignMentorModalData.subject = subject
  assignMentorModalData.currentMentor = currentMentor
  assignMentorModalData.student = props.student

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

async function removeMentor(subject: Subject) {
  try {
    await userService.removeMentor(props.student.id, subject.id, {
      showLoader: true
    })
    emits('mentor-assigned')
  } catch (error: any) {
    uiService.openErrorModal('Не удалось отвязать куратора', error.message)
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
		margin-bottom: 1.5em
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

	&__no-mentors
		p
			color: var(--text-light)
</style>
