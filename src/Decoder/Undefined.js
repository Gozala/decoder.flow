/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { TypeError } from "./Error"

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
  static read({ Undefined }: UndefinedDecoder<a>, input: mixed): Decode<a> {
    if (input === undefined) {
      return Undefined
    } else {
      return new TypeError("undefined", input)
    }
  }
}
