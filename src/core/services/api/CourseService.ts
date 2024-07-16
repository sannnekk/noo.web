import type { Context } from '@/core/context/Context'
import { ApiService } from '@/core/services/ApiService'
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
    return await this.httpGet<Course>(`${this._route}/${slug}`)
  }

  /**
   * Get courses
   */
  public async getCourses(pagination: Pagination) {
    return await this.httpGet<Course[]>(this._route, pagination as any)
  }

  /**
   * Create course
   */
  public async createCourse(course: Course) {
    await this.httpPost<Course>(this._route, course)
  }

  /**
   * Update course
   */
  public async updateCourse(slug: string, course: Course) {
    await this.httpPatch<Course>(`${this._route}/${slug}`, course)
  }

  /**
   * Assign work to material
   */
  public async assignWorkToMaterial(
    materialSlug: string,
    workId: string,
    deadlines: Deadlines
  ) {
    await this.httpPatch<AssignedWork>(
      `${this._route}/${materialSlug}/assign-work/${workId}`,
      deadlines
    )
  }

  /**
   * Assign students to course
   */
  public async assignStudentsToCourse(
    courseSlug: string,
    studentIds: User['id'][]
  ) {
    await this.httpPatch(`${this._route}/${courseSlug}/assign-students`, {
      studentIds
    })
  }

  /**
   * Add students to course
   */
  public async addStudentsToCourse(
    courseSlug: string,
    studentIds: User['id'][]
  ) {
    await this.httpPatch(`${this._route}/${courseSlug}/add-students`, {
      studentIds
    })
  }

  /**
   * Remove students from course
   */
  public async removeStudentsFromCourse(
    courseSlug: string,
    studentIds: User['id'][]
  ) {
    await this.httpPatch(`${this._route}/${courseSlug}/remove-students`, {
      studentIds
    })
  }

  /**
   * Add users to course using emails
   */
  public async addStudentsViaEmail(
    courseSlug: string,
    studentEmails: string[]
  ) {
    await this.httpPatch(
      `${this._route}/${courseSlug}/add-students-via-emails`,
      studentEmails
    )
  }

  /**
   * Delete course
   */
  public async deleteCourse(slug: string) {
    await this.httpDelete(`${this._route}/${slug}`)
  }
}
