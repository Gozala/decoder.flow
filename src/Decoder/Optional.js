/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { Error } from "./Error"
import * as Variant from "./Decoder"

export interface OptionalDecoder<a = *, optional = ?a> {
  type: "Optional";
  optional: Decoder<a>;
}

export default class Optional<a> implements OptionalDecoder<a> {
  type: "Optional" = "Optional"
  optional: Decoder<a>
  static decode<a>(decoder: Decoder<a>, input: mixed): Decode<?a> {
    const value = Variant.decode(decoder, input)
    if (value instanceof Error) {
      if (input == null) {
        return null
      } else {
        return value
      }
    } else {
      return value
    }
  }
  constructor(decoder: Decoder<a>) {
    this.optional = decoder
  }
}
