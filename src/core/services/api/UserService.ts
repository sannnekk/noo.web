import type { Pagination } from '@/core/data/Pagination'
import type { Context } from '@/core/context/Context'
import type { User } from '@/core/data/entities/User'
import { ApiService, type ApiResponse } from '@/core/services/ApiService'

export type UserRelations = 'students' | 'mentor' | 'courses'

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
  public async getUser(username: string): Promise<ApiResponse<User | null>> {
    return await this.httpGet<User>(`${this._route}/${username}`)
  }

  /**
   * get users
   */
  public async getUsers(pagination?: Pagination): Promise<ApiResponse<User[]>> {
    return await this.httpGet<User[]>(this._route, pagination)
  }

  /**
   * get students
   */
  public async getStudents(
    pagination?: Pagination
  ): Promise<ApiResponse<User[]>> {
    return await this.httpGet<User[]>(
      `${this._route}/student/search`,
      pagination
    )
  }

  /**
   * get own students
   */
  public async getOwnStudents(
    pagination?: Pagination
  ): Promise<ApiResponse<User[]>> {
    return await this.httpGet<User[]>(
      `${this._route}/student/search/own`,
      pagination
    )
  }

  /**
   * get mentors
   */
  public async getMentors(
    pagination?: Pagination
  ): Promise<ApiResponse<User[]>> {
    return await this.httpGet<User[]>(
      `${this._route}/mentor/search`,
      pagination
    )
  }

  /**
   * get teachers
   */
  public async getTeachers(
    pagination?: Pagination
  ): Promise<ApiResponse<User[]>> {
    return await this.httpGet<User[]>(
      `${this._route}/teacher/search`,
      pagination
    )
  }

  /**
   * assign mentor to student
   */
  public async assignMentor(
    studentId: User['id'],
    mentorId: User['id']
  ): Promise<void> {
    await this.httpPatch(
      `${this._route}/${studentId}/assign-mentor/${mentorId}`
    )
  }

  /**
   * update user
   */
  public async updateUser(
    userId: User['id'],
    user: Partial<User> & { id: User['id'] }
  ): Promise<void> {
    await this.httpPatch(`${this._route}/${userId}`, user)
  }

  /**
   * delete user
   */
  public async deleteUser(id: User['id']): Promise<void> {
    await this.httpDelete(`${this._route}/${id}`)
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
  public async confirmUser(username: string): Promise<void> {
    await this.httpPatch(`${this._route}/${username}/verify-manual`)
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
