import mitt from 'mitt'

interface IEventEmitter {
  emit<T>(event: string, data: T): void
  on<T>(event: string, handler: (data: T) => void): void
  off<T>(event: string, handler: (data: T) => void): void
}

class EventEmitter implements IEventEmitter {
  private mitt = mitt()

  constructor() {}

  public emit<T>(event: string, data: T) {
    this.mitt.emit(event, data)
  }

  public on<T>(event: string, handler: (data: T) => void) {
    this.mitt.on(event, handler)
  }

  public off<T>(event: string, handler: (data: T) => void) {
    this.mitt.off(event, handler)
  }
}

export { EventEmitter, type IEventEmitter }
