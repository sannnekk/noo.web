import type { Context } from '@/core/context/Context'
import { ApiService, type ApiResponse } from '@/core/services/ApiService'
import type { Course } from '@/core/data/entities/Course'
import type { Pagination } from '@/core/data/Pagination'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { User } from '@/core/data/entities/User'

type Deadlines = { checkDeadline?: Date; solveDeadline?: Date }

/**
 * Course service
 */
export class CourseService extends ApiService {
  private _route = '/course' as const

  /**
   * constructor
   */
  public constructor(context: Context) {
    super(context)
  }

  /**
   * Get course
   */
  public async getCourse(slug: string) {
    return this.httpGet<Course>(`${this._route}/${slug}`)
  }

  /**
   * Get courses
   */
  public async getCourses(pagination: Pagination) {
    return this.httpGet<Course[]>(this._route, pagination as any)
  }

  /**
   * Get assigned work to course
   */
  public async getAssignedWorkToMaterial(slug: string) {
    return this.httpGet<AssignedWork>(
      `${this._route}/material/${slug}/assigned-work`
    )
  }

  /**
   * Create course
   */
  public async createCourse(course: Course) {
    this.httpPost<Course>(this._route, course)
  }

  /**
   * Update course
   */
  public async updateCourse(slug: string, course: Course) {
    this.httpPatch<Course>(`${this._route}/${slug}`, course)
  }

  /**
   * Assign work to material
   */
  public async assignWorkToMaterial(
    materialSlug: string,
    workId: string,
    deadlines: Deadlines
  ) {
    this.httpPatch<AssignedWork>(
      `${this._route}/${materialSlug}/assign-work/${workId}`,
      deadlines
    )
  }

  /**
   * Assign students to course
   */
  public assignStudentsToCourse(courseSlug: string, studentIds: User['id'][]) {
    this.httpPatch(`${this._route}/${courseSlug}/assign-students`, {
      studentIds
    })
  }

  /**
   * Delete course
   */
  public async deleteCourse(slug: string) {
    this.httpDelete(`${this._route}/${slug}`)
  }
}
