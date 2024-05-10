export { EventEmitter } from './event-emitter'

export type {
  EventHandlerMap,
  EventType,
  GenericEventMap,
  GenericEventHandler,

  // internals prefixed with _
  ToTuple as _ToTuple,
  WildcardHandler as _WildcardHandler,
  RemoveEventListener as _RemoveEventListener,
  EventHandlerList as _EventHandlerList,
  WildCardEventHandlerList as _WildCardEventHandlerList,
  Handler as _Handler,
} from './event-emitter'
