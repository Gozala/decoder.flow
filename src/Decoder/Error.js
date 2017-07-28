/* @flow */

const anArticle = /^(a|e[^u]|i|o|u)/i

export class Error {
  +describe: (context: string) => string
  where(context: string): string {
    const result = context == `` ? `` : ` at ${context}`

    return result
  }
}

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

export class ThrownError extends Error {
  exception: { message: string }
  constructor(exception: { message: string }) {
    super()
    this.exception = exception
  }
  describe(context: string): string {
    return `An exception was thrown by ${context}: ${this.exception.message}`
  }
}
