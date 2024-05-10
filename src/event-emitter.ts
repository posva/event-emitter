/**
 * Valid event tyes.
 */
export type EventType = string | symbol

/**
 * Generic event map used for type checking.
 */
export type GenericEventMap = Record<EventType, unknown>

/**
 * Event handler function. Transforms tuples into rest parameters.
 */
export type Handler<Payload> = (...payload: ToTuple<Payload>) => void

/**
 * Convenience type for a list of event handlers.
 */
export type EventHandlerList<Payload = unknown> = Handler<Payload>[]

/**
 * Convenience type for a list of wildcard event handlers.
 */
export type WildCardEventHandlerList<EventMap extends GenericEventMap> =
  WildcardHandler<EventMap>[]

/**
 * Map of event names to registered handler functions.
 */
export type EventHandlerMap<EventMap extends GenericEventMap> = Map<
  keyof EventMap | '*',
  | EventHandlerList<EventMap[keyof EventMap]>
  | WildCardEventHandlerList<EventMap>
>

export type GenericEventHandler<EventMap extends GenericEventMap> =
  | Handler<EventMap[keyof EventMap]>
  | WildcardHandler<EventMap>

/**
 * Convenience type for the returned function of `on`.
 */
export type RemoveEventListener = () => void

/**
 * Event handler function for the `'*'` event type.
 */
export type WildcardHandler<EventMap extends GenericEventMap> = (
  ...args: {
    [Event in keyof EventMap]: [type: Event, payloads: ToTuple<EventMap[Event]>]
  }[keyof EventMap]
) => void

/**
 * Transforms a non tuple into a tuple with the value but keeps tuples as is.
 */
export type ToTuple<T> = T extends [unknown, ...unknown[]] | [] ? T : [T]

type A = ToTuple<[1, 2, 3]> // [1, 2, 3]
type B = ToTuple<number[]> // [number[]]
type C = ToTuple<number> // [number]

/**
 * Event emitter class.
 */
export class EventEmitter<Events extends GenericEventMap> {
  /**
   * A Map of event names to registered handler functions.
   */
  all: EventHandlerMap<Events>

  constructor(all?: EventHandlerMap<Events>) {
    this.all = all || new Map()
  }

  /**
   * Register an event handler for the given type.
   * @param type Type of event to listen for, or `'*'` for all events
   * @param handler Function to call in response to given event
   */
  on<Key extends keyof Events>(
    type: Key,
    handler: Handler<Events[Key]>,
  ): RemoveEventListener
  /**
   * Register an event handler for all events.
   * @param type `'*'`
   * @param handler Function to call in response to given event
   */
  on(type: '*', handler: WildcardHandler<Events>): RemoveEventListener
  on(
    type: EventType,
    handler: GenericEventHandler<Events>,
  ): RemoveEventListener {
    if (!this.all.has(type)) {
      this.all.set(type, [])
    }
    const handlers: Array<GenericEventHandler<Events>> = this.all.get(type)!
    handlers.push(handler)

    return () => handlers.splice(handlers.indexOf(handler) >>> 0, 1)
  }

  /**
   * Remove an event handler for the given type.
   * If `handler` is omitted, all handlers of the given type are removed.
   * @param type Type of event to unregister `handler` from, or `'*'`
   * @param handler Handler function to remove
   */
  off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void
  /**
   * Remove all event handlers.
   */
  off(): void
  off(type?: EventType, handler?: GenericEventHandler<Events>): void {
    if (!type) {
      return this.all.clear()
    }

    const handlers: Array<GenericEventHandler<Events>> | undefined =
      this.all.get(type)
    if (handlers) {
      if (handler) {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1)
      } else {
        this.all.delete(type)
      }
    }
  }

  /**
   * Invoke all handlers for the given type.
   * If present, `'*'` handlers are invoked after type-matched handlers.
   *
   * Note: Manually firing `'*'` handlers is not supported.
   *
   * @param type The event type to invoke
   * @param payload Any value to each handler
   */
  emit<Key extends keyof Events>(
    type: Key,
    ...payload: ToTuple<Events[Key]>
  ): void {
    let handlers:
      | EventHandlerList<Events[keyof Events]>
      | WildCardEventHandlerList<Events>
      | undefined = this.all.get(type) as
      | EventHandlerList<Events[keyof Events]>
      | undefined

    // copy to trigger handlers even if they are removed
    handlers?.slice().map((handler) => {
      handler(...payload)
    })

    handlers = this.all.get('*') as WildCardEventHandlerList<Events> | undefined
    if (handlers) {
      handlers.slice().map((handler) => {
        handler(type, payload)
      })
    }
  }
}
