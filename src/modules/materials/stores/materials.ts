import { type Course } from '@/types/entities/Course'
import type { Material } from '@/types/entities/Material'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMaterialsStore = defineStore('materials', () => {
  const courses = ref<Course[]>([
    {
      id: '1',
      slug: '1',
      name: 'Химия',
      image: 'https://picsum.photos/680/680?2',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      author: {
        id: '1',
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/300?img=1'
      },
      chapters: [
        {
          id: '11',
          name: 'Глава 1',
          slug: 'chapter123',
          courseId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          materials: [
            {
              id: '211',
              name: '3.12 Черви. Теор день',
              description: `- Тип Плоские Черви <br>
                - Тип Круглые Черви <br>
                - Тип Кольчатые Черви`,
              content: `То, что нужно для ЕГЭ больше всего: 
                Таблица в 2 странички большим шрифтом + циклы из рабочей тетради 
                <br><br>                
                Тут не так много, как кажется. Не пихайте все в себя за 1 раз прохождения теории. 
                Выучите и поймите все из таблицы + циклы. В остальное окунётесь потом.
                <br><br>
                Циклы дублируются и тут, и в уроке ПН, поэтому смотреть можете либо сейчас, либо в уроке на пн. 
                <br><br>
                <b>Вебинар по теме: вторник 7 декабря 17:00 мск</b>
                <br><br>
                <iframe frameborder="0" src="https://www.youtube.com/embed/qfF4A17H8K8?si=ioUOZqepqGbfaUzS" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
              slug: '211',
              chapterId: '21',
              createdAt: new Date(),
              updatedAt: new Date(),
              workId: '123'
            },
            {
              id: '212',
              name: 'Материал 2',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae n',
              content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae n',
              slug: '212',
              chapterId: '21',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        },
        {
          id: '12',
          name: 'Глава 2',
          slug: 'chapter456',
          courseId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          materials: [
            {
              id: '221',
              name: 'Материал 3',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae n',
              content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae n',
              slug: '221',
              chapterId: '22',
              createdAt: new Date(),
              updatedAt: new Date(),
              workId: '456'
            }
          ]
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      slug: '2',
      name: 'Биология',
      image: 'https://picsum.photos/680/680?1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      author: {
        id: '2',
        name: 'Олександр Іванович',
        avatar: 'https://i.pravatar.cc/300?img=1'
      },
      chapters: [
        {
          id: '21',
          name: 'Глава 1',
          slug: 'chapter123',
          courseId: '2',
          createdAt: new Date(),
          updatedAt: new Date(),
          materials: [
            {
              id: '211',
              name: 'Материал 1',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae n',
              content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae n',
              slug: '111',
              chapterId: '123',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              id: '222',
              name: 'Материал 2',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae n',
              content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae n',
              slug: '112',
              chapterId: '123',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        },
        {
          id: '12',
          name: 'Глава 2',
          slug: 'chapter456',
          courseId: '2',
          createdAt: new Date(),
          updatedAt: new Date(),
          materials: [
            {
              id: '121',
              name: 'Материал 3',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae n',
              content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae n',
              slug: '121',
              chapterId: '456',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])

  function getCourseById(courseId: string): Course | undefined {
    return courses.value.find(({ id }) => id === courseId)
  }

  function getMaterialsTree(courseId: string) {
    const course = getCourseById(courseId)

    if (!course || !course.chapters) return []

    return course.chapters.map((chapter) => {
      return {
        ...chapter,
        children: chapter.materials
      }
    })
  }

  function getMaterialBySlug(
    courseId: string,
    slug: string
  ): Material | undefined {
    const course = getCourseById(courseId)

    if (!course || !course.chapters) return undefined

    const materials = course.chapters.flatMap((chapter) => chapter!.materials)

    return materials.find((material) => material?.slug === slug)
  }

  return {
    courses,
    getMaterialsTree,
    getMaterialBySlug,
    getCourseById
  }
})
