/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { TypeError } from "./Error"
import Codec from "./Codec"

export interface StringDecoder<a> {
  type: "String"
}

const decode = Codec((_: Decoder<string>, input: mixed): Decode<string> => {
  if (typeof input === "string") {
    return input
  } else if (input instanceof String) {
    return `${input}`
  } else {
    return new TypeError("String", input)
  }
})

export default class StringCodec implements StringDecoder<string> {
  type: "String" = "String"
  static decode = decode
}
