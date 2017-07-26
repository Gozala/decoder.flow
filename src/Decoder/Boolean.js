/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { BadPrimitive } from "./Error"
import Codec from "./Codec"

export interface BooleanDecoder<a> {
  type: "Boolean"
}

const decode = Codec((input: mixed, _: Decoder<boolean>): Decode<boolean> => {
  if (input === true) {
    return (true: any)
  } else if (input === false) {
    return (false: any)
  } else {
    return new BadPrimitive("a Boolean", input)
  }
})

export default class Boolean {
  static decode = decode
}
