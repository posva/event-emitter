import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EventEmitter, type EventHandlerMap } from './event-emitter'

describe('EventEmitter', () => {
  it('can be created with no arguments', () => {
    expect(() => new EventEmitter()).not.toThrow()
  })

  it('should accept an optional event handler map', () => {
    expect(() => new EventEmitter(new Map())).not.toThrow()
    const map = new Map()
    const a = vi.fn()
    const b = vi.fn()
    map.set('foo', [a, b])
    const events = new EventEmitter<{ foo: [] }>(map)
    events.emit('foo')
    expect(a).toHaveBeenCalledOnce()
    expect(b).toHaveBeenCalledOnce()
  })

  const eventType = Symbol('eventType')
  type Events = {
    foo: unknown
    constructor: unknown
    FOO: unknown
    bar: unknown
    Bar: unknown
    'baz:bat!': unknown
    'baz:baT!': unknown
    Foo: unknown
    [eventType]: unknown
  }

  let events: EventHandlerMap<Events>, inst: EventEmitter<Events>

  beforeEach(() => {
    events = new Map()
    inst = new EventEmitter(events)
  })

  describe('properties', () => {
    it('should expose the event handler map', () => {
      expect(inst).toHaveProperty('all', expect.any(Map))
    })
  })

  describe('on()', () => {
    it('should be a function', () => {
      expect(inst).toHaveProperty('on', expect.any(Function))
    })

    it('should register handler for new type', () => {
      const foo = vi.fn()
      inst.on('foo', foo)

      expect(events.get('foo')).toEqual([foo])
    })

    it('should register handlers for any type strings', () => {
      const foo = vi.fn()
      inst.on('constructor', foo)

      expect(events.get('constructor')).toEqual([foo])
    })

    it('should append handler for existing type', () => {
      const foo = vi.fn()
      const bar = vi.fn()
      inst.on('foo', foo)
      inst.on('foo', bar)

      expect(events.get('foo')).toEqual([foo, bar])
    })

    it('should NOT normalize case', () => {
      const foo = vi.fn()
      inst.on('FOO', foo)
      inst.on('Bar', foo)
      inst.on('baz:baT!', foo)

      expect(events.get('FOO')).toEqual([foo])
      expect(events.has('foo')).toEqual(false)
      expect(events.get('Bar')).toEqual([foo])
      expect(events.has('bar')).toEqual(false)
      expect(events.get('baz:baT!')).toEqual([foo])
    })

    it('can take symbols for event types', () => {
      const foo = vi.fn()
      inst.on(eventType, foo)
      expect(events.get(eventType)).toEqual([foo])
    })

    // Adding the same listener multiple times should register it multiple times.
    // See https://nodejs.org/api/events.html#events_emitter_on_eventname_listener
    it('should add duplicate listeners', () => {
      const foo = vi.fn()
      inst.on('foo', foo)
      inst.on('foo', foo)
      expect(events.get('foo')).toEqual([foo, foo])
    })
  })

  describe('off()', () => {
    it('should be a function', () => {
      expect(inst).toHaveProperty('off', expect.any(Function))
    })

    it('should remove handler for type', () => {
      const foo = vi.fn()
      inst.on('foo', foo)
      inst.off('foo', foo)

      expect(events.get('foo')).toHaveLength(0)
    })

    it('should NOT normalize case', () => {
      const foo = vi.fn()
      inst.on('FOO', foo)
      inst.on('Bar', foo)
      inst.on('baz:bat!', foo)

      inst.off('FOO', foo)
      inst.off('Bar', foo)
      inst.off('baz:baT!', foo)

      expect(events.get('FOO')).toHaveLength(0)
      expect(events.has('foo')).toEqual(false)
      expect(events.get('Bar')).toHaveLength(0)
      expect(events.has('bar')).toEqual(false)
      expect(events.get('baz:bat!')).toHaveLength(1)
    })

    it('should remove only the first matching listener', () => {
      const foo = vi.fn()
      inst.on('foo', foo)
      inst.on('foo', foo)
      inst.off('foo', foo)
      expect(events.get('foo')).toEqual([foo])
      inst.off('foo', foo)
      expect(events.get('foo')).toHaveLength(0)
    })

    it('off("type") should remove all handlers of the given type', () => {
      inst.on('foo', vi.fn())
      inst.on('foo', vi.fn())
      inst.on('bar', vi.fn())
      inst.off('foo')
      expect(events.get('foo')).toBeUndefined()
      expect(events.get('bar')).toHaveLength(1)
      inst.off('bar')
      expect(events.get('bar')).toBeUndefined()
    })

    it('off() should remove all handlers', () => {
      inst.on('foo', vi.fn())
      inst.on('bar', vi.fn())
      inst.off()
      expect(events.size).toBe(0)
    })
  })

  describe('emit()', () => {
    it('should be a function', () => {
      expect(inst).toHaveProperty('emit', expect.any(Function))
    })

    it('should invoke handler for type', () => {
      const event = { a: 'b' }

      inst.on('foo', (one, two?: unknown) => {
        expect(one).toEqual(event)
        expect(two).toBeUndefined()
      })

      inst.emit('foo', event)
    })

    it('should NOT ignore case', () => {
      const onFoo = vi.fn(),
        onFOO = vi.fn()
      events.set('Foo', [onFoo])
      events.set('FOO', [onFOO])

      inst.emit('Foo', 'Foo arg')
      inst.emit('FOO', 'FOO arg')

      expect(onFoo).toHaveBeenCalledOnce()
      expect(onFoo).toHaveBeenCalledWith('Foo arg')
      expect(onFOO).toHaveBeenCalledOnce()
      expect(onFOO).toHaveBeenCalledWith('FOO arg')
    })

    it('should invoke * handlers', () => {
      const star = vi.fn(),
        ea = { a: 'a' },
        eb = { b: 'b' }

      events.set('*', [star])

      inst.emit('foo', ea)
      expect(star).toHaveBeenCalledOnce()
      expect(star).toHaveBeenCalledWith('foo', [ea])
      star.mockClear()

      inst.emit('bar', eb)
      expect(star).toHaveBeenCalledOnce()
      expect(star).toHaveBeenCalledWith('bar', [eb])
    })
  })
})
