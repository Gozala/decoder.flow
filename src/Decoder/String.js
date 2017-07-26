/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { BadPrimitive } from "./Error"
import Codec from "./Codec"

export interface StringDecoder<a> {
  type: "String"
}

const decode = Codec((input: mixed, _: Decoder<string>): Decode<string> => {
  if (typeof input === "string") {
    return input
  } else if (input instanceof String) {
    return `${input}`
  } else {
    return new BadPrimitive("a String", input)
  }
})

export default class StringCodec {
  static decode = decode
}
