import { type Ref, computed } from 'vue'
import { useDate } from './useDate'

interface Options {
  precision?: 'year' | 'month' | 'day'
  reversed?: boolean
}

export function useDatedList(
  list: () => any[],
  dateProperty: string,
  options?: Options
): Ref<any[]> {
  const listRef = computed(doDatedList)

  function doDatedList() {
    let items = [...list()]

    if (items.find((item) => item.type === 'date'))
      items = items.filter((item) => item.type !== 'date')

    const datedList = []
    items.reverse()

    let toPush: [
      any,
      {
        id: string
        type: string
        date: Date
        _hashProp?: any
      }
    ] = [] as any

    for (const item of items) {
      const dateItem = {
        id: 'date-' + item[dateProperty].getTime(),
        type: 'date',
        date: item[dateProperty]
      }

      const date = useDate(item[dateProperty])

      if (options?.precision) {
        switch (options.precision) {
          case 'year':
            toPush = [
              item,
              {
                _hashProp: item[dateProperty].getFullYear(),
                ...dateItem
              }
            ]
            break
          case 'month':
            toPush = [
              item,
              {
                _hashProp: `${item[dateProperty].getFullYear()} ${item[
                  dateProperty
                ].getMonth()}`,
                ...dateItem
              }
            ]
            break
          case 'day':
            toPush = [
              item,
              {
                _hashProp: `${item[dateProperty].getFullYear()} ${item[
                  dateProperty
                ].getMonth()} ${item[dateProperty].getDate()}}`,
                ...dateItem
              }
            ]
            break
        }
      } else if (!date.isInThisYear()) {
        toPush = [
          item,
          {
            _hashProp: item[dateProperty].getFullYear(),
            ...dateItem
          }
        ]
      } else if (!date.isInThisMonth()) {
        toPush = [
          item,
          {
            _hashProp: item[dateProperty].getMonth(),
            ...dateItem
          }
        ]
      } else if (!date.isOnThisWeek()) {
        toPush = [
          item,
          {
            _hashProp: 'this-month',
            ...dateItem
          }
        ]
      } else if (!date.isYesterday()) {
        toPush = [
          item,
          {
            _hashProp: 'this-week',
            ...dateItem
          }
        ]
      } else if (!date.isToday()) {
        toPush = [
          item,
          {
            _hashProp: 'yesterday',
            ...dateItem
          }
        ]
      } else {
        toPush = [
          item,
          {
            _hashProp: 'today',
            ...dateItem
          }
        ]
      }

      //if (options?.reversed) toPush.reverse()

      datedList.push(...toPush)
    }

    datedList.reverse()

    const result = datedList.filter((value, index, self) => {
      const a = !Object.keys(value).includes('_hashProp')
      const b =
        !a && index === self.findIndex((t) => t._hashProp === value._hashProp)

      return a || b
    })

    if (options?.reversed) result.reverse()

    return result
  }

  return listRef
}
