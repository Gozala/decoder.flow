/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { Bad } from "./Error"

export interface FailDecoder<a> {
  type: "Fail",
  fail: string
}

export default class Fail<a> implements FailDecoder<a> {
  type: "Fail" = "Fail"
  fail: string
  static decode<a>(input: mixed, { fail }: FailDecoder<a>): Decode<a> {
    return new Bad(fail)
  }
  constructor(fail: string) {
    this.fail = fail
  }
}
