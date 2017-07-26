/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { BadPrimitive } from "./Error"

export interface UndefinedDecoder<a> {
  type: "Undefined",
  fallback: a
}

export default class Undefined<a> implements UndefinedDecoder<a> {
  type: "Undefined" = "Undefined"
  fallback: a
  static decode(input: mixed, { fallback }: UndefinedDecoder<a>): Decode<a> {
    if (input === undefined) {
      return fallback
    } else {
      return new BadPrimitive("undefined", input)
    }
  }
}
