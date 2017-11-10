/* @flow */

import type { Decoder, Decode } from "./Decoder"

export interface OkDecoder<+a> {
  type: "Ok";
  value: a;
}

export default class Ok<a> implements OkDecoder<a> {
  type: "Ok" = "Ok"
  value: a
  static decode(value: a, input: mixed): Decode<a> {
    return value
  }
  constructor(value: a) {
    this.value = value
  }
}
