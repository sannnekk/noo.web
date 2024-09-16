import type { Context } from '@/core/context/Context'
import { ApiService, type ServiceOptions } from '@/core/services/ApiService'
import type { Course } from '@/core/data/entities/Course'
import type { Pagination } from '@/core/data/Pagination'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { User } from '@/core/data/entities/User'
import type { CourseAssignment } from '@/core/data/entities/CourseAssignment'

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
  public async getCourse(slug: string, options: ServiceOptions = {}) {
    return await this.httpGet<Course>(
      `${this._route}/${slug}`,
      undefined,
      {},
      options
    )
  }

  /**
   * Get courses
   */
  public async getCourses(
    pagination?: Pagination,
    options: ServiceOptions = {}
  ) {
    return await this.httpGet<Course[]>(
      this._route,
      pagination,
      undefined,
      options
    )
  }

  /**
   * Get courses by student
   */
  public async getStudentCourses(
    studentId: User['id'],
    pagination?: Pagination,
    options: ServiceOptions = {}
  ) {
    return await this.httpGet<CourseAssignment[]>(
      `${this._route}/student/${studentId}`,
      pagination,
      undefined,
      options
    )
  }

  /**
   * archive course assignment
   */
  public async archiveAssignment(
    assignmentId: CourseAssignment['id'],
    options: ServiceOptions = {}
  ) {
    await this.httpPatch(
      `${this._route}/${assignmentId}/archive`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * unarchive course assignment
   */
  public async unarchiveAssignment(
    assignmentId: CourseAssignment['id'],
    options: ServiceOptions = {}
  ) {
    await this.httpPatch(
      `${this._route}/${assignmentId}/unarchive`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Create course
   */
  public async createCourse(course: Course, options: ServiceOptions = {}) {
    await this.httpPost<Course>(this._route, course, undefined, options)
  }

  /**
   * Update course
   */
  public async updateCourse(
    slug: string,
    course: Course,
    options: ServiceOptions = {}
  ) {
    await this.httpPatch<Course>(
      `${this._route}/${slug}`,
      course,
      undefined,
      options
    )
  }

  /**
   * Assign work to material
   */
  public async assignWorkToMaterial(
    materialSlug: string,
    workId: string,
    deadlines: Deadlines,
    options: ServiceOptions = {}
  ) {
    await this.httpPatch<AssignedWork>(
      `${this._route}/${materialSlug}/assign-work/${workId}`,
      deadlines,
      undefined,
      options
    )
  }

  /**
   * Assign students to course
   */
  public async assignStudentsToCourse(
    courseSlug: string,
    studentIds: User['id'][],
    options: ServiceOptions = {}
  ) {
    await this.httpPatch(
      `${this._route}/${courseSlug}/assign-students`,
      {
        studentIds
      },
      undefined,
      options
    )
  }

  /**
   * Add students to course
   */
  public async addStudentsToCourse(
    courseSlug: string,
    studentIds: User['id'][],
    options: ServiceOptions = {}
  ) {
    await this.httpPatch(
      `${this._route}/${courseSlug}/add-students`,
      {
        studentIds
      },
      undefined,
      options
    )
  }

  /**
   * Remove students from course
   */
  public async removeStudentsFromCourse(
    courseSlug: string,
    studentIds: User['id'][],
    options: ServiceOptions = {}
  ) {
    await this.httpPatch(
      `${this._route}/${courseSlug}/remove-students`,
      {
        studentIds
      },
      undefined,
      options
    )
  }

  /**
   * Add users to course using emails
   */
  public async addStudentsViaEmail(
    courseSlug: string,
    emails: string[],
    options: ServiceOptions = {}
  ) {
    await this.httpPatch(
      `${this._route}/${courseSlug}/add-students-via-emails`,
      { emails },
      undefined,
      options
    )
  }

  /**
   * Remove students from course using emails
   */
  public async removeStudentsViaEmail(
    courseSlug: string,
    emails: string[],
    options: ServiceOptions = {}
  ) {
    await this.httpPatch(
      `${this._route}/${courseSlug}/remove-students-via-emails`,
      { emails },
      undefined,
      options
    )
  }

  /**
   * Delete course
   */
  public async deleteCourse(slug: string, options: ServiceOptions = {}) {
    await this.httpDelete(`${this._route}/${slug}`, undefined, options)
  }
}
