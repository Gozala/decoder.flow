/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { TypeError } from "./Error"

export interface NullDecoder<a> {
  type: "Null";
  Null: a;
}

export default class Null<a> implements NullDecoder<a> {
  type: "Null" = "Null"
  Null: a
  constructor(Null: a) {
    this.Null = Null
  }
  static decode(Null: a, input: mixed): Decode<a> {
    if (input === null) {
      return Null
    } else {
      return new TypeError("null", input)
    }
  }
}
