# EventEmitter [![ci](https://github.com/posva/event-emitter/actions/workflows/ci.yml/badge.svg)](https://github.com/posva/event-emitter/actions/workflows/ci.yml) [![npm package](https://badgen.net/npm/v/@posva/event-emitter?)](https://www.npmjs.com/package/@posva/event-emitter) [![codecov](https://codecov.io/github/posva/event-emitter/graph/badge.svg?token=37fOzdCXYi)](https://codecov.io/github/posva/event-emitter) [![thanks](https://badgen.net/badge/thanks/♥/pink)](https://esm.dev/open-source)

> Typed event and lightweight event emitter with a class based API

- ⛓️ **Typed**: Powerful autocompletion and type checking
- 📦 **Class based**: Add event emitting to your classes
- 💨 **Lightweight**: 188 bytes min+brotli
- 🌐 **Runtime Agnostic**: Works everywhere: Browser, node, Bun...

## Installation

```sh
npm i @posva/event-emitter
```

## Usage

```ts
import { EventEmitter } from '@posva/event-emitter'

const emitter = new EventEmitter<{
  // Define the events you want to emit and their arguments
  start: []
  // non tuples are also supported
  end: { reason: string }

  // You can also define multiple arguments
  sum: [number, number]
}>()

// no arguments
emitter.emit('start')
// object payload
emitter.emit('end', { reason: 'finished' })
// multiple arguments
emitter.emit('sum', 1, 2)

emitter.on('end', ({ reason }) => console.log('ended:', reason))

// You can also listen to all events

emitter.on('*', (event, payload) => {
  if (event === 'end') {
    // payload is always an array
    const [{ reason }] = payload
  } else if (event === 'sum') {
    const [a, b] = payload
  }
})
```

Since `EventEmitter` is a class, you can extend it in your own classes:

```ts
class CardGame extends EventEmitter<{
  start: []
  end: { winner: string }
  draw: [player: string, card: string]
  play: [player: string, card: string]
}> {
  start() {
    this.emit('start')
  }

  end(winner: string) {
    this.emit('end', { winner })
  }
}
```

## API

Most of the code can be discovered through the autocompletion but the API documentation is available at [https://event-emitter.esm.is](https://event-emitter.esm.is).

## Related

- [mitt](https://github.com/developit/mitt): this library is a fork of mitt with a class based API and better types

## License

[MIT](http://opensource.org/licenses/MIT)
