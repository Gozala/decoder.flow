/* @flow */

const anArticle = /^(a|e[^u]|i|o|u)/i

export interface ErrorDecoder {
  type: "Error";
  +message: string;
}

export class Error implements ErrorDecoder {
  +message: string
  description: string
  name: string = "Error"
  type = "Error"
  static decode<a>(decoder: ErrorDecoder, input: mixed): Error {
    if (decoder instanceof Error) {
      return decoder
    } else {
      return new Error(decoder.message)
    }
  }
  constructor(description: string = "") {
    if (description !== "") {
      this.description = description
    }
  }
  describe(context: string) {
    return `${this.where(context)}${this.description}`
  }
  where(context: string): string {
    const result = context == `` ? `` : ` at ${context}`

    return result
  }
  toJSON(): ErrorDecoder {
    return {
      type: "Error",
      message: this.message
    }
  }
}

// Flow cannot safely type getter and setter properties, so using them is an
// error by default. It is possible to set a setting to allow them but then
// every signle user (direct or intderect) will have to enable it for themselfs
// and may even shoot themselvs in the foot. There for instead we just trick
// flow into thinking it's a regular property, that way computation of the
// error messages is deferred until it's being used. For details see:
// https://flow.org/en/docs/config/options/#toc-unsafe-enable-getters-and-setters-boolean
Object.defineProperties(
  Error.prototype,
  ({
    message: {
      enumerable: true,
      configurable: true,
      get() {
        const value = this.describe("")
        Object.defineProperty(this, "message", {
          enumerable: true,
          configurable: false,
          writable: false,
          value
        })
        return value
      }
    }
  }: Object)
)

const articleFor = word => (anArticle.test(word) ? "an" : "a")
const serialize = (value: mixed): string => {
  switch (typeof value) {
    case "boolean":
      return `${String(value)}`
    case "string":
      return JSON.stringify(value)
    case "number":
      return `${value}`
    case "undefined":
      return "undefined"
    case ("symbol": any):
      return (value: any).toString()
    case "function": {
      try {
        return `${value.toString()}`
      } catch (_) {
        return `function() {/*...*/}`
      }
    }
    case "object":
    default: {
      if (value === null) {
        return `null`
      } else {
        try {
          const json = JSON.stringify(value)
          switch (json.charAt(0)) {
            case "{":
              return json
            case "[":
              return json
            case "t":
              return `new Boolean(true)`
            case "f":
              return `new Boolean(false)`
            case '"':
              return `new String(${json})`
            default:
              return `new Number(${json})`
          }
        } catch (_) {
          return `{/*...*/}`
        }
      }
    }
  }
}

export class TypeError extends Error {
  name = "TypeError"
  expect: string
  actual: mixed
  article: string
  constructor(
    expect: string,
    actual: mixed,
    article: string = articleFor(expect)
  ) {
    super()
    this.actual = actual
    this.expect = expect
    this.article = article
  }
  describe(context: string): string {
    const where = this.where(context)
    const actual = serialize(this.actual)
    const expect = `${this.article} ${this.expect}`

    return `Expecting ${expect}${where} but instead got: \`${actual}\``
  }
}

export class MissmatchError extends Error {
  expect: mixed
  actual: mixed
  constructor(actual: mixed, expect: mixed) {
    super()
    this.actual = actual
    this.expect = expect
  }
  describe(context: string): string {
    const where = this.where(context)
    const actual = serialize(this.actual)
    const expect = serialize(this.expect)

    return `Expecting \`${expect}\`${where} but instead got: \`${actual}\``
  }
}

export class ThrownError extends Error {
  name = "ThrowError"
  exception: { message: string }
  constructor(exception: { message: string }) {
    super()
    this.exception = exception
  }
  describe(context: string): string {
    return `An exception was thrown by ${context}: ${this.exception.message}`
  }
}

export default Error
