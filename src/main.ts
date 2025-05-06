import App from '@/App.vue'
import { registerModules } from '@/modules-registrar'
import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'

// adding modules
import AssignedWorksModule from '@/modules/assigned-works'
import AuthModule from '@/modules/auth'
//import CalenderModule from '@/modules/calender'
//import CourseStudentsModule from '@/modules/course-students'
//import CoursesModule from '@/modules/courses'
//import CreateCourseModule from '@/modules/create-course'
//import CreateWorkModule from '@/modules/create-work'
//import HelpModule from '@/modules/help'
//import NooTubeModule from '@/modules/nootube'
//import PollsModule from '@/modules/polls'
//import ProfileModule from '@/modules/profile'
//import SettingsModule from '@/modules/settings'
//import TablesModule from '@/modules/tables'
//import UsersModule from '@/modules/users'
//import WorksModule from '@/modules/works'

const app = createApp(App)

const { router, diContainer } = registerModules([
  AssignedWorksModule,
  AuthModule,
  CalenderModule,
  CourseStudentsModule,
  CoursesModule,
  CreateCourseModule,
  CreateWorkModule,
  HelpModule,
  NooTubeModule,
  PollsModule,
  ProfileModule,
  SettingsModule,
  TablesModule,
  UsersModule,
  WorksModule
])

// adding plugins
app.use(router)
app.use(createPinia())

// inject raw (not reactive!) dependencies
for (const [key, value] of Object.entries(diContainer)) {
  app.provide(key, markRaw(value))
}

// mounting the app
app.mount('#root')
