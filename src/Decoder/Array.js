/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { TypeError, Error } from "./Error"
import { IndexError } from "./Index"
import * as Variant from "./Decoder"

export interface ArrayDecoder<a, +array = a[]> {
  type: "Array";
  array: Decoder<a>;
}

export default class Array<a> implements ArrayDecoder<a> {
  type: "Array" = "Array"
  array: Decoder<a>
  static isArray = [].constructor.isArray
  constructor(decoder: Decoder<a>) {
    this.array = decoder
  }
  static decode<a>(decoder: Decoder<a>, input: mixed): a[] | Error {
    if (Array.isArray(input)) {
      let index = 0
      const array = []
      for (let element of ((input: any): mixed[])) {
        const value = Variant.decode(decoder, element)
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
  }
}
