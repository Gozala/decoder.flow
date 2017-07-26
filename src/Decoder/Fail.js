/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { Bad } from "./Error"

export interface FailDecoder<a> {
  type: "Fail",
  reason: string
}

export default class Fail<a> implements FailDecoder<a> {
  type: "Fail" = "Fail"
  reason: string
  static decode<a>(input: mixed, { reason }: FailDecoder<a>): Decode<a> {
    return new Bad(reason)
  }
}
