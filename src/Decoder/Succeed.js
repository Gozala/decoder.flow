/* @flow */

import type { Decoder, Decode } from "./Decoder"

export interface SucceedDecoder<a> {
  type: "Succeed",
  value: a
}

export default class SucceedCodec<a> implements SucceedDecoder<a> {
  type: "Succeed" = "Succeed"
  value: a
  static decode(input: mixed, { value }: SucceedDecoder<a>): Decode<a> {
    return value
  }
}
