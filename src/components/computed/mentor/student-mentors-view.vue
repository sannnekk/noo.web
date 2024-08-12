<template>
  <div class="student-mentors-view">
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
              <user-card :user="subject.assignment.mentor" />
              <common-button
                design="inline"
                v-if="Core.Context.roleIs(['admin', 'mentor', 'teacher'])"
                @click="
                  openAssignMentorModal(
                    subject,
                    subject.assignment?.mentor || null,
                    subject.assignment?.student || null
                  )
                "
              >
                Сменить куратора
              </common-button>
            </div>
            <div
              v-else
              class="student-mentors-view__card__mentor__assign-button"
              @click="
                openAssignMentorModal(
                  subject,
                  null,
                  subject.assignment?.student || null
                )
              "
            >
              <span>
                <icon name="edit" />
                Назначить куратора
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="student-mentors-view__no-mentors">
          Кураторы пока не назначены
        </div>
      </div>
    </div>
  </div>
  <student-mentors-view-modal
    v-model:visible="assignMentorModalData.visibility"
    :subject="assignMentorModalData.subject!"
    :current-mentor="assignMentorModalData.currentMentor"
    :student="assignMentorModalData.student!"
  />
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { MentorAssignment } from '@/core/data/entities/MentorAssignment'
import type { Subject } from '@/core/data/entities/Subject'
import { computed, reactive, ref } from 'vue'

interface SubjectToShow extends Subject {
  assignment: MentorAssignment | null
}

interface Props {
  mentorAssignments: MentorAssignment[]
}

interface Emits {
  (e: 'update:mentorAssignments', value: MentorAssignment[]): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const subjectService = Core.Services.Subject

const subjects = ref<Subject[]>([])
const assignMentorModalVisible = ref(false)

const assignMentorModalData = reactive({
  visibility: assignMentorModalVisible,
  subject: null as Subject | null,
  currentMentor: null as MentorAssignment['mentor'] | null,
  student: null as MentorAssignment['student'] | null
})

subjects.value = (await subjectService.getSubjects()).data

const subjectsToSHow = computed<SubjectToShow[]>(() => {
  if (!subjects.value.length) {
    return []
  }

  if (Core.Context.roleIs(['student'])) {
    const subjectsToSHow: SubjectToShow[] = []

    for (const subject of subjects.value) {
      const mentorAssignment = props.mentorAssignments.find((assignment) => {
        return assignment.subjectId === subject.id
      })

      if (mentorAssignment) {
        subjectsToSHow.push({
          ...subject,
          assignment: mentorAssignment
        })
      }
    }

    return subjectsToSHow
  }

  return subjects.value.map((subject) => {
    return {
      ...subject,
      assignment:
        props.mentorAssignments.find((assignment) => {
          return assignment.subjectId === subject.id
        }) || null
    }
  })
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
</script>

<style scoped lang="sass"></style>
