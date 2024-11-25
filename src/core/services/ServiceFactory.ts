import type { Context } from '../context/Context'
import { AssignedWorkService } from './api/AssignedWorkService'
import { AuthService } from './api/AuthService'
import { BlogService } from './api/BlogService'
import { CalenderService } from './api/CalenderService'
import { CourseService } from './api/CourseService'
import { FAQService } from './api/FAQService'
import { GoogleSheetsBindingService } from './api/GoogleSheetsBindingService'
import { MediaService } from './api/MediaService'
import { NotificationService } from './store/NotificationService'
import { PlatformService } from './api/PlatformService'
import { PollService } from './api/PollService'
import { SessionService } from './api/SessionService'
import { SnippetService } from './api/SnippetService'
import { StatisticsService } from './api/StatisticsService'
import { SubjectService } from './api/SubjectService'
import { UserService } from './api/UserService'
import { WorkService } from './api/WorkService'
import { UIService } from './store/UIService'
import { UserSettingsService } from './store/UserSettingsService'
import { VideoService } from './api/VideoService'

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
  | 'Session'
  | 'GoogleSheetsBinding'
  | 'Subject'
  | 'Platform'
  | 'Snippet'
  | 'FAQ'
  | 'Video'
  | 'UserSettings'

export type Services = {
  Auth: AuthService
  Work: WorkService
  AssignedWork: AssignedWorkService
  User: UserService
  Course: CourseService
  Media: MediaService
  Statistics: StatisticsService
  Calender: CalenderService
  Blog: BlogService
  Poll: PollService
  Session: SessionService
  GoogleSheetsBinding: GoogleSheetsBindingService
  Subject: SubjectService
  Platform: PlatformService
  Snippet: SnippetService
  FAQ: FAQService
  Video: VideoService

  Notification: NotificationService
  UI: UIService
  UserSettings: UserSettingsService
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
    Calender: CalenderService,
    Blog: BlogService,
    Poll: PollService,
    Session: SessionService,
    GoogleSheetsBinding: GoogleSheetsBindingService,
    Subject: SubjectService,
    Platform: PlatformService,
    Snippet: SnippetService,
    FAQ: FAQService,
    Video: VideoService,

    // storage
    Notification: NotificationService,
    UI: UIService,
    UserSettings: UserSettingsService
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
