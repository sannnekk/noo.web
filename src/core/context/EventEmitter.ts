import type { Context } from './Context'

export type EventName = 'global:logout' | 'global:login' | 'global:init'

export type EventFunc = (context: Context, ...args: any[]) => void

/**
 * Event emitter
 */
export class EventEmitter {
  private events = new Map<EventName, EventFunc[]>()

  /**
   * Add event listener
   */
  public on(event: EventName, listener: EventFunc | EventFunc[]) {
    if (Array.isArray(listener)) {
      listener.forEach((l) => this.on(event, l))
      return
    }

    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(listener)
  }

  /**
   * Add many events
   */
  public onMany(events: { [K in EventName]: EventFunc[] }) {
    for (const event in events) {
      this.on(event as EventName, events[event as EventName])
    }
  }

  /**
   * Remove event listener
   */
  public off(event: EventName, listener: EventFunc) {
    if (this.events.has(event)) {
      this.events.set(
        event,
        this.events.get(event)!.filter((l) => l !== listener)
      )
    }
  }

  /**
   * Emit event
   */
  public emit(event: EventName, context: Context, ...args: any[]) {
    if (this.events.has(event)) {
      this.events.get(event)!.forEach((listener) => listener(context, ...args))
    }
  }
}
