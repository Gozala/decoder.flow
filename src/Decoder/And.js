/* @flow */

import type { Decoder, Decode } from "./Decoder"
import * as Variant from "./Decoder"
import { Error } from "./Error"

export interface AndDecoder<+a, +b> {
  type: "And";
  left: Decoder<a>;
  right: Decoder<b>;
}

export default class And<a, b> implements AndDecoder<a, b> {
  type: "And" = "And"
  left: Decoder<a>
  right: Decoder<b>
  constructor(left: Decoder<a>, right: Decoder<b>) {
    this.left = left
    this.right = right
  }
  static decode<a, b>(
    left: Decoder<a>,
    right: Decoder<b>,
    input: mixed
  ): Decode<b> {
    const result = Variant.decode(left, input)
    if (result instanceof Error) {
      return result
    } else {
      return Variant.decode(right, input)
    }
  }
}
