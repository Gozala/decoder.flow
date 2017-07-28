/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { Error } from "./Error"
import * as decoder from "./Decoder"

export class EitherError extends Error {
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
  static decode<a>(input: mixed, { either }: EitherDecoder<a>): Decode<a> {
    let problems = null
    for (let option of either) {
      const data = decoder.decode(input, option)
      if (data instanceof Error) {
        problems = problems == null ? [data] : (problems.push(data), problems)
      } else {
        return data
      }
    }

    return new EitherError(problems || [])
  }
}
