import { richTextsAreEqual } from '@/core/utils/richtext.utils'
import type { AssignedWorkAnswerEntity } from '../api/assigned-work.types'

function answersAreEqual(
  answer1: AssignedWorkAnswerEntity,
  answer2: AssignedWorkAnswerEntity
): boolean {
  return (
    answer1.taskId === answer2.taskId &&
    answer1.score === answer2.score &&
    answer1.wordContent === answer2.wordContent &&
    JSON.stringify(answer1.detailedScore) ===
      JSON.stringify(answer2.detailedScore) &&
    richTextsAreEqual(answer1.richTextContent, answer2.richTextContent) &&
    richTextsAreEqual(answer1.mentorComment, answer2.mentorComment)
  )
}

export { answersAreEqual }
