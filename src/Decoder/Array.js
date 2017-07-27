/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { BadPrimitive, BadIndex, Error } from "./Error"
import * as decoder from "./Decoder"
import Codec from "./Codec"

export interface ArrayDecoder<a> {
  type: "Array",
  elementDecoder: Decoder<a>
}

const decode = Codec(<a>(input: mixed, self: ArrayDecoder<a>):
  | Array<a>
  | Error => {
  const { elementDecoder } = self
  if (Array.isArray(input)) {
    let index = 0
    const array = []
    for (let element of ((input: any): mixed[])) {
      const data = decoder.decode(element, elementDecoder)
      if (data instanceof Error) {
        return new BadIndex(index, data)
      } else {
        array[index] = data
      }
      index++
    }
    return array
  } else {
    return new BadPrimitive("an Array", input)
  }
})

export default class ArrayCodec<a> implements ArrayDecoder<a> {
  type: "Array" = "Array"
  elementDecoder: Decoder<a>
  constructor(decoder: Decoder<a>) {
    this.elementDecoder = decoder
  }
  static decode = decode
}
