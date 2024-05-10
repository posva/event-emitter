import { EventEmitter } from './event-emitter'

function test() {
  const mySymbol = Symbol()
  type E = {
    a: { isA: boolean }
    b: { isB: boolean }
    c: []
    rest: [a: string, b: number]
    numbers: number[]
    [mySymbol]: string
  }

  const emitter = new EventEmitter<E>()

  emitter.on('a', (payload) => {
    payload.isA
  })
  // @ts-expect-error: no args
  emitter.on('c', (e) => {})
  // @ts-expect-error: no args
  emitter.emit('c', [])
  emitter.on('c', () => {})
  emitter.emit('c')

  emitter.on('rest', (a, b) => {
    a.endsWith('')
    b.toFixed(2)
  })

  emitter.on('numbers', (numbers) => {
    numbers.length
    numbers.forEach((n) => n.toFixed(2))
  })

  emitter.on('*', (type, payload) => {
    if (type === 'a') {
      const [a] = payload
      a.isA
    } else if (type === 'rest') {
      const [a, b] = payload
      a.endsWith('')
      b.toFixed(2)
    } else if (type === 'numbers') {
      const [numbers] = payload
      numbers.length
      numbers.forEach((n) => n.toFixed(2))
    }
  })
}
