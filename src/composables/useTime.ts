import { isRef, computed, type ComputedRef, type Ref } from 'vue'

export function useTime(date: Date | Ref<Date>): ComputedRef<string> {
  function doTime() {
    const time = isRef(date) ? date.value : date

    if (!time) {
      return ''
    }

    const hours = time.getHours()
    const minutes = time.getMinutes()
    const hoursString = hours < 10 ? `0${hours}` : `${hours}`
    const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`
    return `${hoursString}:${minutesString}`
  }

  return computed(doTime)
}
