/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { Error } from "./Error"
import * as decoder from "./Decoder"
import Codec from "./Codec"

export interface MaybeDecoder<a> {
  type: "Maybe",
  maybe: Decoder<a>
}

const decode = Codec(
  <a>(input: mixed, { maybe }: MaybeDecoder<a>): Decode<?a> => {
    const value = decoder.decode(input, maybe)
    if (value instanceof Error) {
      return null
    } else {
      return value
    }
  }
)

export default class Maybe<a> implements MaybeDecoder<a> {
  type: "Maybe" = "Maybe"
  maybe: Decoder<a>
  static decode = decode
  constructor(decoder: Decoder<a>) {
    this.maybe = decoder
  }
}
