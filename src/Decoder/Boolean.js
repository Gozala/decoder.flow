/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { TypeError } from "./Error"

export interface BooleanDecoder<a = boolean> {
  type: "Boolean";
}

export default class Boolean implements BooleanDecoder<boolean> {
  type: "Boolean" = "Boolean"
  static decode(input: mixed): Decode<boolean> {
    if (input === true) {
      return true
    } else if (input === false) {
      return false
    } else {
      return new TypeError("Boolean", input)
    }
  }
}
