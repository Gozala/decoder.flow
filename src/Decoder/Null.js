/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { BadPrimitive } from "./Error"

export interface NullDecoder<a> {
  type: "Null",
  fallback: a
}

export default class Null<a> implements NullDecoder<a> {
  type: "Null" = "Null"
  fallback: a
  static decode(input: mixed, { fallback }: NullDecoder<a>): Decode<a> {
    if (input === null) {
      return fallback
    } else {
      return new BadPrimitive("null", input)
    }
  }
}
