import { onBeforeUnmount, onMounted } from 'vue'
import { GlobalEventBus, type GlobalEvents } from '../events/event-bus'

function useGlobalEventBus(
  event: keyof GlobalEvents,
  callback: (payload: GlobalEvents[typeof event]) => void
): void {
  onMounted(() => {
    GlobalEventBus.on(event, callback)
  })

  onBeforeUnmount(() => {
    GlobalEventBus.off(event, callback)
  })
}

export { useGlobalEventBus }
