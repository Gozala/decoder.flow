/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { TypeError } from "./Error"

export interface BooleanDecoder {
  type: "Boolean";
}

export default class Boolean implements BooleanDecoder {
  type: "Boolean" = "Boolean"
  static read(self: Decoder<boolean>, input: mixed): Decode<boolean> {
    if (input === true) {
      return (true: any)
    } else if (input === false) {
      return (false: any)
    } else {
      return new TypeError("Boolean", input)
    }
  }
}
