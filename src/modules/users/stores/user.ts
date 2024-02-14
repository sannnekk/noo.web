import { useGlobalStore } from '@/store'
import type { User } from '@/types/entities/User'
import type { Work } from '@/types/entities/Work'
import { http } from '@/utils/http'
import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export const useUsersStore = defineStore('', () => {
  const _globalStore = useGlobalStore()
  const route = useRoute()

  const pagination = reactive({
    page: 5,
    total: 170
  })

  const users = reactive<User[]>([
    /* {
      id: '1',
      slug: '1',
      name: 'Иванов Иван Иванович',
      username: 'nukleoid',
      role: 'student',
      email: 'nukleoid@outlook.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      telegramId: '1234567890'
    },
    {
      id: '2',
      slug: '2',
      name: 'Петров Петр Петрович',
      username: 'petrov',
      role: 'admin',
      email: 'maria@gmail.com',
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      telegramId: '1234567890'
    },
    {
      id: '3',
      slug: '3',
      name: 'Сидоров Сидор Сидорович',
      username: 'sidorov',
      role: 'mentor',
      email: 'sidorov@s.ru',
      avatar: 'https://i.pravatar.cc/150?img=3',
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      telegramId: '1234567890'
    },
    {
      id: '4',
      slug: '4',
      name: 'Мария Иванова',
      username: 'maria',
      role: 'teacher',
      email: 'teacher@noo.ru',
      avatar: 'https://i.pravatar.cc/150?img=4',
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      telegramId: '1234567890'
    } */
  ])
  const user = ref<User>()
  const works = reactive<Work[]>([])
  const foundMentors = reactive<User[]>([])

  const search = ref('')
  const listLoading = ref(false)
  const mentorsSearch = ref('')

  watch(
    [() => route.path, search],
    () => {
      if (route.params.username) {
        _globalStore.setLoading(true)
        http
          .get(`/user/${route.params.username}`)
          .then((data) => {
            user.value = data
          })
          .catch(() => {
            _globalStore.openModal('error', 'Ошибка при загрузке данных')
          })
          .finally(() => {
            _globalStore.setLoading(false)
          })
      } else {
        listLoading.value = true
        http
          .get('/user', { search: search.value })
          .then((response) => {
            users.splice(0, users.length)
            users.push(...response.data)
            pagination.total = response.total
          })
          .catch((e) => {
            _globalStore.openModal('error', 'Ошибка при загрузке данных')
          })
          .finally(() => {
            listLoading.value = false
          })
      }
    },
    { immediate: true }
  )

  watch(mentorsSearch, () => {
    if (mentorsSearch.value.length > 1) {
      getMentors(mentorsSearch.value)
    }
  })

  function getUser(userId: string) {
    return users.find((user) => user.id === userId)
  }

  async function saveUser() {
    _globalStore.setLoading(true)

    try {
      await http.patch(`/user/${user.value?.id}`, user.value)
      _globalStore.openModal('success', 'Данные успешно сохранены')
    } catch (error) {
      _globalStore.openModal('error', 'Ошибка при сохранении данных')
    } finally {
      _globalStore.setLoading(false)
    }
  }

  function assignWork(studentId: string, workId: string) {
    _globalStore.setLoading(true)
    http
      .post('/assigned-work', { studentId, workId })
      .then(() => {
        _globalStore.openModal('success', 'Работа успешно присвоена')
      })
      .catch(() => {
        _globalStore.openModal('error', 'Ошибка при присвоении работы')
      })
      .finally(() => _globalStore.setLoading(false))
  }

  function getMentors(searchStr: string) {
    http
      .get('/user/mentor/search', {
        search: searchStr
      })
      .then((response) => {
        foundMentors.splice(0, foundMentors.length)
        foundMentors.push(...response.data)
        pagination.total = response.total
      })
      .catch((e) => {
        if (e.status === 404) {
          return foundMentors.splice(0, foundMentors.length)
        }

        _globalStore.openModal('error', 'Ошибка при загрузке данных')
      })
  }

  function assignMentor(mentorId: string) {
    http
      .patch(`/user/${user.value!.id}/assign-mentor/${mentorId}`)
      .then(() => {
        _globalStore.openModal('success', 'Куратор успешно присвоен')
      })
      .catch(() => {
        _globalStore.openModal('error', 'Ошибка при присвоении куратора')
      })
  }

  return {
    users,
    pagination,
    user,
    search,
    listLoading,
    mentorsSearch,
    foundMentors,
    getUser,
    saveUser,
    assignWork,
    works,
    assignMentor
  }
})
