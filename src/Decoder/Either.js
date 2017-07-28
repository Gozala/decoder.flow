/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { Error } from "./Error"
import * as Reader from "./Decoder"

export class EitherError extends Error {
  name = "EitherError"
  problems: Error[]
  constructor(problems: Error[]) {
    super()
    this.problems = problems
  }
  describe(context: string): string {
    const { problems } = this
    const descriptions = problems
      .map(problem => problem.describe(context))
      .join("\n")
    const where = this.where(context)

    return `Ran into the following problems${where}:\n\n${descriptions}`
  }
}

export interface EitherDecoder<a> {
  type: "Either",
  either: Array<Decoder<a>>
}

export default class EitherCodec<a> implements EitherDecoder<a> {
  type: "Either" = "Either"
  either: Array<Decoder<a>>
  constructor(decoders: Array<Decoder<a>>) {
    this.either = decoders
  }
  static decode<a>({ either }: EitherDecoder<a>, input: mixed): Decode<a> {
    let problems = null
    for (let decoder of either) {
      const value = Reader.decode(decoder, input)
      if (value instanceof Error) {
        problems = problems == null ? [value] : (problems.push(value), problems)
      } else {
        return value
      }
    }

    return new EitherError(problems || [])
  }
}
