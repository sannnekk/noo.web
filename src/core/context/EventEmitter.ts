type EventName = 'global:logout' | 'global:login'

export class EventEmitter {
  private events = new Map<EventName, Function[]>()

  public on(event: EventName, listener: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(listener)
  }

  public off(event: EventName, listener: Function) {
    if (this.events.has(event)) {
      this.events.set(
        event,
        this.events.get(event)!.filter((l) => l !== listener)
      )
    }
  }

  public emit(event: EventName, ...args: any[]) {
    if (this.events.has(event)) {
      this.events.get(event)!.forEach((listener) => listener(...args))
    }
  }
}
