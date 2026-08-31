import type { Task } from '@/core/data/entities/Task'

/**
 * Collect all the unique tags used by the given tasks, sorted alphabetically
 */
export function collectTaskTags(tasks: Pick<Task, 'tags'>[]): string[] {
  const tags = new Set<string>()

  for (const task of tasks) {
    for (const tag of task.tags || []) {
      tags.add(tag)
    }
  }

  return [...tags].sort((a, b) => a.localeCompare(b))
}

/**
 * Check if the task has the given tag
 */
export function taskHasTag(task: Pick<Task, 'tags'>, tag: string): boolean {
  return (task.tags || []).includes(tag)
}
