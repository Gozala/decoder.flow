/* @flow */

export class Error {
  +describe: (context: string) => string
  where(context: string): string {
    const result = context == `` ? `` : ` at ${context}`

    return result
  }
}

export class BadPrimitive extends Error {
  type: string
  value: *
  constructor(type: string, value: *) {
    super()
    this.type = type
    this.value = value
  }
  serialize(value: *): string {
    const type = typeof value
    switch (type) {
      case "boolean":
        return `${value}`
      case "string":
        return JSON.stringify(value)
      case "number":
        return `${value}`
      case "undefined":
        return "undefined"
      case "symbol":
        return value.toString()
      case "function": {
        try {
          return `${value}`
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
  describe(context: string): string {
    const where = this.where(context)
    const value = this.serialize(this.value)

    return `Expecting ${this.type}${where} but instead got: \`${value}\``
  }
}

export class BadIndex extends Error {
  index: number
  nested: Error
  constructor(index: number, nested: Error) {
    super()
    this.index = index
    this.nested = nested
  }
  describe(context: string): string {
    return this.nested.describe(`${context}[${this.index}]`)
  }
}

export class BadField extends Error {
  field: string
  nested: Error
  constructor(field: string, nested: Error) {
    super()
    this.field = field
    this.nested = nested
  }
  describe(context: string): string {
    return this.nested.describe(`${context}["${this.field}"]`)
  }
}

export class BadAccessor extends Error {
  field: string
  nested: Error
  constructor(field: string, nested: Error) {
    super()
    this.field = field
    this.nested = nested
  }
  where(context: string): string {
    const result =
      context === `` ? `["${this.field}"]` : ` at ${context}["${this.field}"]`

    return result
  }
  describe(context: string): string {
    const message = this.nested.describe("")
    const where = this.where(context)

    return `Accessor thew an exception decoder${where}:${message}`
  }
}

export class BadEither extends Error {
  problems: Error[]
  constructor(problems: Error[]) {
    super()
    this.problems = problems
  }
  describe(context: string): string {
    const { problems } = this
    const descriptions = problems
      .map(problem => problem.describe(""))
      .join("\n")
    const where = this.where(context)

    return `I ran into the following problems${where}:\n\n${descriptions}`
  }
}

export class Bad extends Error {
  reason: string
  constructor(reason: string) {
    super()
    this.reason = reason
  }
  describe(context: string): string {
    const { reason } = this
    const where = this.where(context)

    return `Ran into a "fail" decoder${where}:${reason}`
  }
}
