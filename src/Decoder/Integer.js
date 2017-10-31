/* @flow */

import type { Decoder, Decode } from "./Decoder"
import type { integer } from "integer.flow"
import { truncate } from "integer.flow"
import { TypeError } from "./Error"

export type { integer }

export interface IntegerDecoder {
  type: "Integer";
}

export default class Integer implements IntegerDecoder {
  type = "Integer"
  static read(decoder: Decoder<integer>, input: mixed): Decode<integer> {
    // Note that if `Number.isInteger(x)` returns `true` we know that `x` is an
    // integer number, but flow can not infer that, there for we trick flow into
    // thinking we also perform typeof input === "number" so it can narrow down
    // type to a number.
    if (Number.isInteger(input) && typeof input === "number") {
      return (truncate(input): any)
    } else {
      return new TypeError("Integer", input)
    }
  }
}
