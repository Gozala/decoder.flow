/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { TypeError, Error } from "./Error"
import { IndexError } from "./Index"
import * as decoder from "./Decoder"
import Codec from "./Codec"

export interface ArrayDecoder<a> {
  type: "Array",
  array: Decoder<a>
}

const decode = Codec(<a>(input: mixed, self: ArrayDecoder<a>):
  | Array<a>
  | Error => {
  const elementDecoder = self.array
  if (Array.isArray(input)) {
    let index = 0
    const array = []
    for (let element of ((input: any): mixed[])) {
      const value = decoder.decode(element, elementDecoder)
      if (value instanceof Error) {
        return new IndexError(index, value)
      } else {
        array[index] = value
      }
      index++
    }
    return array
  } else {
    return new TypeError("Array", input)
  }
})

export default class ArrayCodec<a> implements ArrayDecoder<a> {
  type: "Array" = "Array"
  array: Decoder<a>
  constructor(decoder: Decoder<a>) {
    this.array = decoder
  }
  static decode = decode
}
