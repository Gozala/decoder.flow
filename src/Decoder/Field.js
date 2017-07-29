/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { TypeError, ThrownError, Error } from "./Error"
import * as Reader from "../Reader"

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
  type: "Field",
  name: string,
  field: Decoder<a>
}

export default class Field<a> implements FieldDecoder<a> {
  type: "Field" = "Field"
  name: string
  field: Decoder<a>
  constructor(name: string, field: Decoder<a>) {
    this.name = name
    this.field = field
  }
  static read({ name, field }: FieldDecoder<a>, input: mixed): Decode<a> {
    if (typeof input !== "object" || input === null || !(name in input)) {
      return new TypeError(`object with a field named '${name}'`, input)
    } else {
      try {
        const value = Reader.read(field, input[name])
        if (value instanceof Error) {
          return new FieldError(name, value)
        } else {
          return value
        }
      } catch (error) {
        return new FieldError(name, new ThrownError(error))
      }
    }
  }
}
