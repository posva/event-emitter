import { describe, expectTypeOf, it } from 'vitest'
import { EventEmitter } from './event-emitter'

describe('EventEmitter', () => {
  // added to mix events with different payloads
  type OtherEvents = {
    other: number
    foo: string
    bar: { a: string }
  }

  describe('on()', () => {
    it('handles an event with no payload', () => {
      const emitter = new EventEmitter<{ c: [] } & OtherEvents>()
      emitter.on('c', () => {})
      // @ts-expect-error: no args
      emitter.on('c', (payload) => {})
    })

    it('handles an event with an object payload', () => {
      const emitter = new EventEmitter<{ a: { isA: boolean } } & OtherEvents>()
      emitter.on('a', (payload) => {
        expectTypeOf(payload).toEqualTypeOf<{ isA: boolean }>()
      })
    })

    it('handles an event with multiple arguments as the payload', () => {
      const emitter = new EventEmitter<
        { rest: [a: string, b: number] } & OtherEvents
      >()
      emitter.on('rest', (a, b) => {
        expectTypeOf(a).toEqualTypeOf<string>()
        expectTypeOf(b).toEqualTypeOf<number>()
      })
    })

    it('handles an event with an array payload', () => {
      const emitter = new EventEmitter<{ numbers: number[] } & OtherEvents>()
      emitter.on('numbers', (numbers) => {
        expectTypeOf(numbers).toEqualTypeOf<number[]>()
      })
    })

    it('handles an event with a symbol type', () => {
      const mySymbol = Symbol()
      const emitter = new EventEmitter<{ [mySymbol]: string } & OtherEvents>()
      emitter.on(mySymbol, (payload) => {
        expectTypeOf(payload).toEqualTypeOf<string>()
      })
    })

    describe('wildcard event handler payload', () => {
      it('object', () => {
        const emitter = new EventEmitter<
          { a: { isA: boolean } } & OtherEvents
        >()

        emitter.on('*', (type, payload) => {
          if (type === 'a') {
            expectTypeOf(payload).toEqualTypeOf<[{ isA: boolean }]>()
          }
        })
      })

      it('multiple arguments', () => {
        const emitter = new EventEmitter<
          { rest: [a: string, b: number] } & OtherEvents
        >()

        emitter.on('*', (type, payload) => {
          if (type === 'rest') {
            expectTypeOf(payload).toEqualTypeOf<[string, number]>()
          }
        })
      })

      it('array', () => {
        const emitter = new EventEmitter<{ numbers: number[] } & OtherEvents>()

        emitter.on('*', (type, payload) => {
          if (type === 'numbers') {
            expectTypeOf(payload).toEqualTypeOf<[number[]]>()
          }
        })
      })

      it('symbol', () => {
        const mySymbol = Symbol()
        const emitter = new EventEmitter<{ [mySymbol]: string } & OtherEvents>()

        emitter.on('*', (type, payload) => {
          if (type === mySymbol) {
            expectTypeOf(payload).toEqualTypeOf<[string]>()
          }
        })
      })
    })

    describe('emit', () => {
      it('should throw an error when emitting wrong arguments', () => {
        const emitter = new EventEmitter<{
          c: []
          a: string
          rest: [string, number]
        }>()
        // @ts-expect-error: no args
        emitter.emit('c', 2)

        // @ts-expect-error: wrong type
        emitter.emit('a', 2)

        // @ts-expect-error: missing argument
        emitter.emit('rest', 'a')
      })

      it('should emit an event with no payload', () => {
        const emitter = new EventEmitter<{ c: [] } & OtherEvents>()
        emitter.emit('c')
      })

      it('should emit an event with an object payload', () => {
        const emitter = new EventEmitter<
          { a: { isA: boolean } } & OtherEvents
        >()
        emitter.emit('a', { isA: true })
      })

      it('should emit an event with multiple arguments as the payload', () => {
        const emitter = new EventEmitter<
          { rest: [a: string, b: number] } & OtherEvents
        >()
        emitter.emit('rest', 'a', 2)
      })

      it('should emit an event with an array payload', () => {
        const emitter = new EventEmitter<{ numbers: number[] } & OtherEvents>()
        emitter.emit('numbers', [1, 2, 3])
      })
    })
  })

  describe('off()', () => {
    it('handles removal of event handler', () => {
      const emitter = new EventEmitter<{ c: [] } & OtherEvents>()
      emitter.off('c', () => {})
      // @ts-expect-error: no args
      emitter.off('c', (payload) => {})
    })

    it('handles removal of wildcard event handler', () => {
      const emitter = new EventEmitter<
        { a: { isA: boolean } } & OtherEvents
      >()

      emitter.off('*', (type, payload) => {
        if (type === 'a') {
          expectTypeOf(payload).toEqualTypeOf<[{ isA: boolean }]>()
        }
      })
    })
  })
})
