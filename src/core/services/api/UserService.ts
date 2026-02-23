import type { Pagination } from '@/core/data/Pagination'
import type { Context } from '@/core/context/Context'
import type { User, UserWithOnlineStatus } from '@/core/data/entities/User'
import {
  ApiService,
  type ApiResponse,
  type ServiceOptions
} from '@/core/services/ApiService'
import type { Subject } from '@/core/data/entities/Subject'

export type UserRelations = 'students' | 'mentor' | 'courses'

export type VisibleRole = {
  label: string
  value: User['role']
}

export interface TelegramUpdatePayload {
  telegramId: string | null
  telegramUsername: string | null
  telegramAvatarUrl: string | null
}

export const UserRoleOptions: VisibleRole[] = [
  {
    label: 'Ученик',
    value: 'student'
  },
  {
    label: 'Преподаватель',
    value: 'teacher'
  },
  {
    label: 'Куратор',
    value: 'mentor'
  },
  {
    label: 'Администратор',
    value: 'admin'
  }
]

/**
 * User service
 */
export class UserService extends ApiService {
  private _route = '/user' as const

  /**
   * constructor
   */
  public constructor(context: Context) {
    super(context)
  }

  /**
   * get user by slug
   */
  public async getUser(
    username: string,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<UserWithOnlineStatus | null>> {
    return await this.httpGet<UserWithOnlineStatus>(
      `${this._route}/${username}`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * get users
   */
  public async getUsers(
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<User[]>> {
    return await this.httpGet<User[]>(
      this._route,
      pagination,
      undefined,
      options
    )
  }

  /**
   * get users with mentor if student
   */
  public async getUsersWithMentors(
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<User[]>> {
    const _pagination = { ...pagination }

    _pagination.relations = ['mentorAssignmentsAsStudent']

    return await this.httpGet<User[]>(
      this._route,
      _pagination,
      undefined,
      options
    )
  }

  /**
   * get students
   */
  public async getStudents(
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<User[]>> {
    return await this.httpGet<User[]>(
      `${this._route}/student/search`,
      pagination,
      undefined,
      options
    )
  }

  /**
   * get own students
   */
  public async getOwnStudents(
    userId: User['id'] | undefined,
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<(User & { subject: Subject })[]>> {
    return await this.httpGet<(User & { subject: Subject })[]>(
      `${this._route}/student/search/own${userId ? `/${userId}` : ''}`,
      pagination,
      undefined,
      options
    )
  }

  /**
   * get mentors
   */
  public async getMentors(
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<User[]>> {
    return await this.httpGet<User[]>(
      `${this._route}/mentor/search`,
      pagination,
      undefined,
      options
    )
  }

  /**
   * get teachers
   */
  public async getTeachers(
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<User[]>> {
    return await this.httpGet<User[]>(
      `${this._route}/teacher/search`,
      pagination,
      undefined,
      options
    )
  }

  /**
   * assign mentor to student
   */
  public async assignMentor(
    studentId: User['id'],
    mentorId: User['id'],
    subjectId: Subject['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPatch(
      `${this._route}/${studentId}/${subjectId}/mentor/${mentorId}`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Remove mentor from student
   */
  public async removeMentor(
    studentId: User['id'],
    subjectId: Subject['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(
      `${this._route}/${studentId}/${subjectId}/mentor`,
      undefined,
      options
    )
  }

  /**
   * update user
   */
  public async updateUser(
    userId: User['id'],
    user: Partial<User> & { id: User['id'] },
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPatch(`${this._route}/${userId}`, user, undefined, options)
  }

  /**
   * Change users password
   */
  public async changePassword(
    userId: User['id'],
    oldPassword: string | undefined,
    newPassword: string,
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPatch(
      `${this._route}/${userId}/password`,
      {
        oldPassword,
        newPassword
      },
      undefined,
      options
    )
  }

  /**
   * Change users role
   */
  public async changeRole(
    userId: User['id'],
    role: User['role'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPatch(
      `${this._route}/${userId}/role`,
      {
        role
      },
      undefined,
      options
    )
  }

  /**
   * block user
   */
  public async block(
    id: User['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPatch(
      `${this._route}/${id}/block`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * unblock user
   */
  public async unblock(
    id: User['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPatch(
      `${this._route}/${id}/unblock`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Update telegram
   */
  public async updateTelegram(
    userId: User['id'],
    telegram: TelegramUpdatePayload,
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPatch(
      `${this._route}/${userId}/telegram`,
      telegram,
      undefined,
      options
    )
  }

  /**
   * Request change email
   */
  public async requestChangeEmail(
    userId: User['id'],
    newEmail: string,
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPatch(
      `${this._route}/${userId}/email`,
      {
        email: newEmail
      },
      undefined,
      options
    )
  }

  /**
   * Cancel change email
   */
  public async cancelChangeEmail(
    userId: User['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPatch(
      `${this._route}/${userId}/cancel-email-change`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * delete user
   */
  public async deleteUser(
    id: User['id'],
    password: string,
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(
      `${this._route}/${id}/${password}`,
      undefined,
      options
    )
  }

  /**
   * validate password
   */
  public validatePassword(password: string): boolean {
    return this.passwordCriteria().every((criteria) =>
      criteria.isValid(password)
    )
  }

  /**
   * confirm user
   */
  public async confirmUser(
    username: string,
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPatch(
      `${this._route}/${username}/verify-manual`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * get users password criteria
   */
  public passwordCriteria() {
    return [
      {
        errorText: 'Пароль должен содержать не менее 8 символов',
        label: '8 или более символов',
        isValid: (password: string) => password.length >= 8
      },
      {
        errorText: 'Пароль должен содержать не менее 1 цифры',
        label: '1 цифра',
        isValid: (password: string) => /\d/.test(password)
      },
      {
        errorText:
          'Пароль должен содержать не менее 1 символа в верхнем регистре',
        label: '1 заглавная буква',
        isValid: (password: string) => /[A-Z]/.test(password)
      },
      {
        errorText:
          'Пароль должен содержать не менее 1 символа в нижнем регистре',
        label: '1 строчная буква',
        isValid: (password: string) => /[a-z]/.test(password)
      },
      {
        errorText: 'Пароль не должен содержать пробелов',
        label: 'Без пробелов',
        isValid: (password: string) => !/\s/.test(password)
      }
    ]
  }
}
