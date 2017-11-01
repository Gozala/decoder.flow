/* @flow */

import type { Decoder, Decode } from "./Decoder"
import type { float } from "float.flow"
import { TypeError } from "./Error"
import { toFloat } from "float.flow"

export type { float }

export interface FloatDecoder<a = float> {
  type: "Float";
}

export default class Float implements FloatDecoder<float> {
  type = "Float"
  static decode(input: mixed): Decode<float> {
    // Note that if `Number.isFinite(x)` returns `true` we know that `x` is a
    // finite number, but flow can't infer it there for we trick flow into
    // thinking that we also check typeof input === "number" so it will narrow
    // the type down to number
    if (Number.isFinite(input) && typeof input === "number") {
      return (toFloat(input): any)
    } else {
      return new TypeError("Float", input)
    }
  }
}
