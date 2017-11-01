/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { TypeError, ThrownError, Error } from "./Error"
import * as Variant from "./Decoder"

export class FieldError extends Error {
  name = "FieldError"
  field: string
  problem: Error
  constructor(field: string, problem: Error) {
    super()
    this.field = field
    this.problem = problem
  }
  describe(context: string): string {
    const where = context === "" ? "input" : context
    return this.problem.describe(`${where}["${this.field}"]`)
  }
}

export interface FieldDecoder<a> {
  type: "Field";
  name: string;
  field: Decoder<a>;
}

export default class Field<a> implements FieldDecoder<a> {
  type: "Field" = "Field"
  name: string
  field: Decoder<a>
  constructor(name: string, field: Decoder<a>) {
    this.name = name
    this.field = field
  }
  static decode(name: string, field: Decoder<a>, input: mixed): Decode<a> {
    switch (typeof input) {
      case "function":
      case "object": {
        if (input === null) {
          break
        } else {
          try {
            const value = Variant.decode(field, input[name])
            if (value instanceof Error) {
              if (name in (input: Object)) {
                return new FieldError(name, value)
              } else {
                break
              }
            } else {
              return value
            }
          } catch (error) {
            return new FieldError(name, new ThrownError(error))
          }
        }
      }
    }
    return new TypeError(`object with a field named '${name}'`, input)
  }
}
