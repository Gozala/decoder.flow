/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { BadEither, Error } from "./Error"
import * as decoder from "./Decoder"

export interface EitherDecoder<a> {
  type: "Either",
  either: Array<Decoder<a>>
}

export default class EitherCodec<a> implements EitherDecoder<a> {
  type: "Either" = "Either"
  either: Array<Decoder<a>>
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

    return new BadEither(problems || [])
  }
}
