/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { BadPrimitive, BadIndex, Error } from "./Error"
import * as decoder from "./Decoder"

export interface IndexDecoder<a> {
  type: "Index",
  index: number,
  member: Decoder<a>
}

export default class Index<a> implements IndexDecoder<a> {
  type: "Index" = "Index"
  index: number
  member: Decoder<a>
  static decode(input: mixed, { index, member }: IndexDecoder<a>): Decode<a> {
    if (!Array.isArray(input)) {
      return new BadPrimitive("an array", input)
    } else if (index >= input.length) {
      return new BadPrimitive(
        `a longer array. Need index ${index} but there are only ${input.length}  entries`,
        input
      )
    } else {
      const value = decoder.decode(input[index], member)
      if (value instanceof Error) {
        return new BadIndex(index, value)
      } else {
        return value
      }
    }
  }
}
