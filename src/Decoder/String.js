/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { TypeError } from "./Error"

const StringConstructor = "".constructor

export interface StringDecoder {
  type: "String";
}

export default class String implements StringDecoder {
  type: "String" = "String"
  static read(self: Decoder<string>, input: mixed): Decode<string> {
    if (typeof input === "string") {
      return input
    } else if (input instanceof StringConstructor) {
      return `${input}`
    } else {
      return new TypeError("String", input)
    }
  }
}
