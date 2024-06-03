import type { Context } from '../context/Context'
import { AssignedWorkService } from './api/AssignedWorkService'
import { AuthService } from './api/AuthService'
import { BlogService } from './api/BlogService'
import { CalenderService } from './api/CalenderService'
import { CourseService } from './api/CourseService'
import { MediaService } from './api/MediaService'
import { NotificationService } from './api/NotificationService'
import { PollService } from './api/PollService'
import { StatisticsService } from './api/StatisticsService'
import { UserService } from './api/UserService'
import { WorkService } from './api/WorkService'
import { UIService } from './store/UIService'

export type ServiceName =
  | 'Auth'
  | 'Work'
  | 'AssignedWork'
  | 'User'
  | 'Course'
  | 'Media'
  | 'Statistics'
  | 'Notification'
  | 'UI'
  | 'Calender'
  | 'Blog'
  | 'Poll'

export type Services = {
  Auth: AuthService
  Work: WorkService
  AssignedWork: AssignedWorkService
  User: UserService
  Course: CourseService
  Media: MediaService
  Statistics: StatisticsService
  Notification: NotificationService
  UI: UIService
  Calender: CalenderService
  Blog: BlogService
  Poll: PollService
}

/**
 * Service factory
 */
export class ServiceFactory {
  /**
   * Services of service factory
   */
  private static _services = {
    // api
    Auth: AuthService,
    Work: WorkService,
    AssignedWork: AssignedWorkService,
    User: UserService,
    Course: CourseService,
    Media: MediaService,
    Statistics: StatisticsService,
    Notification: NotificationService,
    Calender: CalenderService,
    Blog: BlogService,
    Poll: PollService,
    // storage
    UI: UIService
  }

  /**
   * Gets services
   */
  public static getServices(context: Context): Services {
    return (Object.keys(this._services) as ServiceName[]).reduce(
      (acc, name) => {
        ;(acc as Record<ServiceName, any>)[name as ServiceName] =
          new this._services[name](context)
        return acc
      },
      {} as Services
    )
  }
}
