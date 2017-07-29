/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { Error, TypeError, ThrownError } from "./Error"
import * as Reader from "../Reader"
import Read from "../Reader/Read"

export class IndexError extends Error {
  name = "IndexError"
  index: number
  problem: Error
  constructor(index: number, problem: Error) {
    super()
    this.index = index
    this.problem = problem
  }
  describe(context: string): string {
    const where = context === "" ? "input" : context
    return this.problem.describe(`${where}[${this.index}]`)
  }
}

export interface IndexDecoder<a> {
  type: "Index",
  index: number,
  member: Decoder<a>
}

export default class Index<a> implements IndexDecoder<a> {
  type: "Index" = "Index"
  index: number
  member: Decoder<a>
  constructor(index: number, member: Decoder<a>) {
    this.index = index
    this.member = member
  }
  static read({ index, member }: IndexDecoder<a>, input: mixed): Decode<a> {
    if (!Array.isArray(input)) {
      return new TypeError("array", input)
    } else if (index >= input.length) {
      return new TypeError(`longer (>=${index + 1}) array`, input)
    } else {
      try {
        const value = Reader.read(member, input[index])
        if (value instanceof Error) {
          return new IndexError(index, value)
        } else {
          return value
        }
      } catch (error) {
        return new IndexError(index, new ThrownError(error))
      }
    }
  }
}
