/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { Error } from "./Error"

export interface FailDecoder<a> {
  type: "Fail",
  fail: string
}

export default class Fail<a> extends Error implements FailDecoder<a> {
  type: "Fail" = "Fail"
  fail: string
  static decode<a>(input: mixed, decoder: FailDecoder<a>): Decode<a> {
    if (decoder instanceof Fail) {
      return decoder
    } else {
      return new Fail(decoder.fail)
    }
  }
  constructor(fail: string) {
    super()
    this.fail = fail
  }
  describe(context: string): string {
    // const where = this.where(context)

    return this.fail
  }
}
