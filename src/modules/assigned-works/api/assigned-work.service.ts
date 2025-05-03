import { type ApiResponse, Api } from '@/core/api/api.utils'
import type {
  AssignedWorkAddMentorOptions,
  AssignedWorkAnswerEntity,
  AssignedWorkCommentEntity,
  AssignedWorkEntity,
  AssignedWorkProgress,
  AssignedWorkRemakeOptions
} from './assigned-work.types'
import type { IPagination } from '@/core/utils/pagination.utils'

const BASE_PATH = '/assigned-works'

interface AssignedWorkService {
  /**
   * Fetches a list of assigned works for the current user or a specific user.
   *
   * @param pagination Pagination object to paginate the results. If not provided, the default pagination will be used.
   * @param userId The ID of the user to get assigned works for. If not provided, the current user will be used.
   * @returns A promise that resolves to an ApiResponse containing an array of AssignedWorkEntity objects.
   */
  get(
    pagination?: IPagination,
    userId?: string
  ): Promise<ApiResponse<AssignedWorkEntity[]>>
  /**
   * Fetches an assigned work by its ID.
   *
   * @param id The ID of the assigned work to fetch.
   * @returns A promise that resolves to an ApiResponse containing the AssignedWorkEntity object.
   */
  getById(id: string): Promise<ApiResponse<AssignedWorkEntity>>
  /**
   * Gets the progress of an assigned work by its ID.
   *
   * @param id The ID of the assigned work to get progress for.
   * @returns A promise that resolves to an ApiResponse containing the AssignedWorkProgress object.
   */
  getProgress(id: string): Promise<ApiResponse<AssignedWorkProgress>>
  /**
   * Creates a new assigned work that will be a copy of the original assigned work but marked as a new attempt
   *
   * @param id The ID of the assigned work to remake
   * @param attempt The id of the new AssignedWorkEntity to be created
   */
  remake(
    id: string,
    remakeOptions?: AssignedWorkRemakeOptions
  ): Promise<ApiResponse<string>>
  /**
   * Gets or creates an assigned work by material ID. The work attached to the material will be used if it exists, otherwise an error will come from the server.
   *
   * @param id The ID of the assigned work to update progress for.
   * @param progress The new progress object to set.
   * @returns A promise that resolves to an ApiResponse containing the updated AssignedWorkProgress object.
   */
  getOrCreateByMaterialId(materialId: string): Promise<ApiResponse<string>>
  /**
   * Marks an assigned work as solved.
   *
   * @param id The ID of the assigned work to mark as solved.
   */
  markSolved(id: string): Promise<ApiResponse>
  /**
   * Marks an assigned work as checked.
   *
   * @param id The ID of the assigned work to mark as checked.
   */
  markChecked(id: string): Promise<ApiResponse>
  /**
   * Save an answer to an assigned work.
   *
   * @param answers The answer objects to save.
   * @returns A promise that resolves to an ApiResponse containing the map with task IDs as keys and answer IDs as values.
   */
  saveAnswers(
    answers: AssignedWorkAnswerEntity[]
  ): Promise<ApiResponse<Record<string, string>>>
  /**
   * Save a comment to an assigned work.
   *
   * @param comment The comment object to save.
   * @returns A promise that resolves to an ApiResponse containing the ID of the saved comment.
   */
  saveComment(comment: AssignedWorkCommentEntity): Promise<ApiResponse<string>>
  /**
   * Archive an assigned work. The work will be archived for the current user or a user role.
   *
   * @param id The ID of the assigned work to be archived.
   */
  archive(id: string): Promise<ApiResponse>
  /**
   * Unarchive an assigned work. The work will be unarchived for the current user or a user role.
   *
   * @param id The ID of the assigned work to be unarchived.
   */
  unarchive(id: string): Promise<ApiResponse>
  /**
   * Add a mentor to an assigned work. If the mentor is already assigned, an error will be returned from server.
   *
   * @param id The ID of the assigned work to add a mentor to.
   * @param mentorId The ID of the mentor to be added.
   * @param options The options for adding the mentor.
   */
  addMentor(
    id: string,
    mentorId: string,
    options: AssignedWorkAddMentorOptions
  ): Promise<ApiResponse>
  /**
   * Remove a mentor from an assigned work. If the mentor is not assigned, an error will be returned from server.
   *
   * @param id The ID of the assigned work to remove a mentor from.
   * @param mentorId The ID of the mentor to be removed.
   */
  removeMentor(id: string, mentorId: string): Promise<ApiResponse>
  /**
   * Replace main mentor of assigned work.
   *
   * @param id The ID of the assigned work to replace the main mentor.
   * @param mentorId The ID of the new main mentor.
   */
  replaceMainMentor(id: string, mentorId: string): Promise<ApiResponse>
  /**
   * Shift the deadline for an assigned work. The deadline will be shifted for the current user or a user role.
   *
   * @param id The ID of the assigned work to shift the deadline for.
   */
  shiftDeadline(id: string): Promise<ApiResponse>
  /**
   * Mark an assigned work as unsolved.
   *
   * @param id The ID of the assigned work to mark as unsolved.
   */
  markUnsolved(id: string): Promise<ApiResponse>
  /**
   * Mark an assigned work as unchecked.
   *
   * @param id The ID of the assigned work to mark as unchecked.
   */
  markUnchecked(id: string): Promise<ApiResponse>
  /**
   * Delete an assigned work.
   *
   * @param id The ID of the assigned work to be deleted.
   */
  delete(id: string): Promise<ApiResponse>
}

async function get(
  pagination?: IPagination
): Promise<ApiResponse<AssignedWorkEntity[]>> {
  return await Api.get(BASE_PATH, pagination ? pagination.toQuery() : undefined)
}

async function getById(id: string): Promise<ApiResponse<AssignedWorkEntity>> {
  return await Api.get(`${BASE_PATH}/${id}`)
}

async function getProgress(
  id: string
): Promise<ApiResponse<AssignedWorkProgress>> {
  return await Api.get(`${BASE_PATH}/${id}/progress`)
}

async function remake(
  id: string,
  remakeOptions?: AssignedWorkRemakeOptions
): Promise<ApiResponse<string>> {
  return await Api.post(`${BASE_PATH}/${id}/remake`, remakeOptions)
}

async function getOrCreateByMaterialId(
  materialId: string
): Promise<ApiResponse<string>> {
  return await Api.get(`${BASE_PATH}/material/${materialId}`)
}

async function markSolved(id: string): Promise<ApiResponse> {
  return await Api.patch(`${BASE_PATH}/${id}/mark-solved`)
}

async function markChecked(id: string): Promise<ApiResponse> {
  return await Api.patch(`${BASE_PATH}/${id}/mark-checked`)
}

async function saveAnswers(
  answers: AssignedWorkAnswerEntity[]
): Promise<ApiResponse<Record<string, string>>> {
  return await Api.post(`${BASE_PATH}/answers`, answers)
}

async function saveComment(
  comment: AssignedWorkCommentEntity
): Promise<ApiResponse<string>> {
  return await Api.post(`${BASE_PATH}/comments`, comment)
}

async function archive(id: string): Promise<ApiResponse> {
  return await Api.patch(`${BASE_PATH}/${id}/archive`)
}

async function unarchive(id: string): Promise<ApiResponse> {
  return await Api.patch(`${BASE_PATH}/${id}/unarchive`)
}

async function addMentor(
  id: string,
  mentorId: string,
  options: AssignedWorkAddMentorOptions
): Promise<ApiResponse> {
  return await Api.patch(`${BASE_PATH}/${id}/mentors/${mentorId}`, options)
}

async function removeMentor(
  id: string,
  mentorId: string
): Promise<ApiResponse> {
  return await Api.delete(`${BASE_PATH}/${id}/mentors/${mentorId}`)
}

async function replaceMainMentor(
  id: string,
  mentorId: string
): Promise<ApiResponse> {
  return await Api.patch(`${BASE_PATH}/${id}/mentors/${mentorId}/replace-main`)
}

async function shiftDeadline(id: string): Promise<ApiResponse> {
  return await Api.patch(`${BASE_PATH}/${id}/shift-deadline`)
}

async function markUnsolved(id: string): Promise<ApiResponse> {
  return await Api.patch(`${BASE_PATH}/${id}/mark-unsolved`)
}

async function markUnchecked(id: string): Promise<ApiResponse> {
  return await Api.patch(`${BASE_PATH}/${id}/mark-unchecked`)
}

async function deleteAssignedWork(id: string): Promise<ApiResponse> {
  return await Api.delete(`${BASE_PATH}/${id}`)
}

export const AssignedWorkService: AssignedWorkService = {
  get,
  getById,
  getProgress,
  remake,
  getOrCreateByMaterialId,
  markSolved,
  markChecked,
  saveAnswers,
  saveComment,
  archive,
  unarchive,
  addMentor,
  removeMentor,
  replaceMainMentor,
  shiftDeadline,
  markUnsolved,
  markUnchecked,
  delete: deleteAssignedWork
}
