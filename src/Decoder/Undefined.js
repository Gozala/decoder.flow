/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { BadPrimitive } from "./Error"

export interface UndefinedDecoder<a> {
  type: "Undefined",
  Undefined: a
}

export default class Undefined<a> implements UndefinedDecoder<a> {
  type: "Undefined" = "Undefined"
  Undefined: a
  constructor(Undefined: a) {
    this.Undefined = Undefined
  }
  static decode(input: mixed, { Undefined }: UndefinedDecoder<a>): Decode<a> {
    if (input === undefined) {
      return Undefined
    } else {
      return new BadPrimitive("undefined", input)
    }
  }
}
