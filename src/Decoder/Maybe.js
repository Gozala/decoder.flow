/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { Error } from "./Error"
import * as decoder from "./Decoder"
import Codec from "./Codec"

export interface MaybeDecoder<a> {
  type: "Maybe",
  some: Decoder<a>
}

const decode = Codec(
  <a>(input: mixed, { some }: MaybeDecoder<a>): Decode<?a> => {
    const value = decoder.decode(input, some)
    if (value instanceof Error) {
      return null
    } else {
      return value
    }
  }
)

export default class Maybe<a> implements MaybeDecoder<a> {
  type: "Maybe" = "Maybe"
  some: Decoder<a>
  static decode = decode
}
