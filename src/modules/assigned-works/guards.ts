import type { NavigationGuardReturn, RouteLocationNormalized } from 'vue-router'
import type { AssignedWorkViewMode } from './types'
import { useAuthStore } from '@/core/stores/auth.store'
import { unref } from 'vue'
import { useAssignedWorkDetailStore } from './stores/assigned-work-detail.store'

async function assignedWorkDetailInitGuard(
  to: RouteLocationNormalized
): Promise<NavigationGuardReturn> {
  const assignedWorkStore = useAssignedWorkDetailStore()

  const assignedWorkId = to.params.assignedWorkId as string
  const initialized = await assignedWorkStore.init(assignedWorkId)

  if (!initialized) {
    return {
      name: 'assigned-works.list'
    }
  }

  return true
}

function assignedWorkModeGuard(
  to: RouteLocationNormalized
): NavigationGuardReturn {
  const authStore = useAuthStore()
  const assignedWorkStore = useAssignedWorkDetailStore()

  const assignedWorkId = to.params.assignedWorkId as string
  const mode = to.params.mode as AssignedWorkViewMode
  const possibleModes: AssignedWorkViewMode[] = ['read', 'solve', 'check']

  const { solveStatus, checkStatus } = unref(assignedWorkStore.assignedWork)!

  // if not student or mentor, redirect to read mode
  if (
    authStore.userInfo?.role !== 'student' &&
    authStore.userInfo?.role !== 'mentor'
  ) {
    return {
      name: 'assigned-works.detail',
      params: { assignedWorkId, mode: 'read' }
    }
  }

  // bad value for mode, redirect to read mode
  if (!possibleModes.includes(mode)) {
    return {
      name: 'assigned-works.detail',
      params: { assignedWorkId, mode: 'read' }
    }
  }

  // if student, make sure the work is not made yet, otherwise redirect to read mode
  if (authStore.userInfo?.role === 'student') {
    if (solveStatus === 'solved') {
      return {
        name: 'assigned-works.detail',
        params: { assignedWorkId, mode: 'read' }
      }
    }

    if (mode === 'check') {
      return {
        name: 'assigned-works.detail',
        params: { assignedWorkId, mode: 'read' }
      }
    }
  }

  // if mentor, make sure the work is not checked yet and already solved, otherwise redirect to read mode
  if (authStore.userInfo?.role === 'mentor') {
    if (solveStatus !== 'solved') {
      return {
        name: 'assigned-works.detail',
        params: { assignedWorkId, mode: 'read' }
      }
    }

    if (checkStatus === 'checked') {
      return {
        name: 'assigned-works.detail',
        params: { assignedWorkId, mode: 'read' }
      }
    }
  }

  return true
}

export { assignedWorkDetailInitGuard, assignedWorkModeGuard }
