/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { TypeError, ThrownError, Error } from "./Error"
import { FieldError } from "./Field"
import * as decoder from "./Decoder"

export class AccessorError extends Error {
  name: string
  problem: Error
  constructor(name: string, problem: Error) {
    super()
    this.name = name
    this.problem = problem
  }
  describe(context: string): string {
    const where = context === "" ? "input" : context
    return this.problem.describe(`${where}["${this.name}"]()`)
  }
}

export interface AccessorDecoder<a> {
  type: "Accessor",
  name: string,
  accessor: Decoder<a>
}

export default class AccessorCodec<a> implements AccessorDecoder<a> {
  type: "Accessor" = "Accessor"
  name: string
  accessor: Decoder<a>
  constructor(name: string, decoder: Decoder<a>) {
    this.name = name
    this.accessor = decoder
  }
  static decode(input: mixed, codec: AccessorDecoder<a>): Decode<a> {
    const { name, accessor } = codec
    if (typeof input === "object" && input != null && name in input) {
      const object: Object = input
      try {
        if (typeof object[name] === "function") {
          const value = decoder.decode(object[name](), accessor)
          if (value instanceof Error) {
            return new AccessorError(name, value)
          } else {
            return value
          }
        } else {
          return new FieldError(name, new TypeError("function", object[name]))
        }
      } catch (error) {
        return new AccessorError(name, new ThrownError(error))
      }
    } else {
      return new TypeError(`object with a method named '${name}'`, input)
    }
  }
}
