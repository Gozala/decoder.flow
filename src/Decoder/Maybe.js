/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { Error } from "./Error"
import * as Variant from "./Decoder"

export interface MaybeDecoder<a = *, +maybe = ?a> {
  type: "Maybe";
  maybe: Decoder<a>;
}

export default class Maybe<a> implements MaybeDecoder<a> {
  type: "Maybe" = "Maybe"
  maybe: Decoder<a>
  static decode<a>(decoder: Decoder<a>, input: mixed): Decode<?a> {
    const value = Variant.decode(decoder, input)
    if (value instanceof Error) {
      if (input == null) {
        return value
      } else {
        return null
      }
    } else {
      return value
    }
  }
  constructor(decoder: Decoder<a>) {
    this.maybe = decoder
  }
}
