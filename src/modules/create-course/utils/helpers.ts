import type { Chapter } from '@/core/data/entities/Chapter'

export function findChapter(
  chapters: Chapter[],
  slug: string
): Chapter | undefined {
  for (const chapter of chapters) {
    if (chapter.slug === slug) return chapter

    if (chapter.chapters?.length) {
      const found = findChapter(chapter.chapters, slug)

      if (found) return found
    }
  }

  return undefined
}

export function findParent(
  chapters: Chapter[],
  slug: string
): Chapter | undefined {
  for (const chapter of chapters) {
    if (chapter.chapters?.find((ch) => ch.slug === slug)) return chapter

    if (chapter.chapters?.length) {
      const found = findParent(chapter.chapters, slug)

      if (found) return found
    }
  }

  return undefined
}
