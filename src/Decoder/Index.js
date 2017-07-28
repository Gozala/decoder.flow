/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { Error, TypeError, ThrownError } from "./Error"
import * as decoder from "./Decoder"

export class IndexError extends Error {
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
  static decode(input: mixed, { index, member }: IndexDecoder<a>): Decode<a> {
    if (!Array.isArray(input)) {
      return new TypeError("array", input)
    } else if (index >= input.length) {
      return new TypeError(`longer (>=${index + 1}) array`, input)
    } else {
      try {
        const value = decoder.decode(input[index], member)
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
