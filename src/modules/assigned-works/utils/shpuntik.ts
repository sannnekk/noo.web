import { Core } from '@/core/Core'

/**
 * Mentors (by email) that are allowed to use Shpuntik when checking works.
 * Keep in sync with the backend list (web-2.0: src/Shpuntik/Constants/ShpuntikMentors.ts).
 */
export const SHPUNTIK_ALLOWED_MENTOR_EMAILS: readonly string[] = [
  'stolpovskihtimur@gmail.com',
  'nikolaikuzmarov29@icloud.com',
  'atrisckina@gmail.com',
  'liraeva60@gmail.com',
  'turvm30@gmail.com',
  'kvinihidzetako@yandex.ru',
  'kirasimakova231@gmail.com',
  'obraztsova.sofja@yandex.ru',
  'mskidan910@gmail.com',
  'vasilieva31viktoria@yandex.ru',
  'mchichvarkina@bk.ru',
  'kanatovaarina000@mail.ru'
]

/**
 * Whether the current user is a mentor that is allowed to use Shpuntik
 */
export function isShpuntikAllowedMentor(): boolean {
  const email = Core.Context.User?.email

  return (
    Core.Context.roleIs(['mentor']) &&
    !!email &&
    SHPUNTIK_ALLOWED_MENTOR_EMAILS.includes(email.trim().toLowerCase())
  )
}
