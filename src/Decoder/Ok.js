/* @flow */

import type { Decoder, Decode } from "./Decoder"

export interface OkDecoder<a> {
  type: "Ok",
  value: a
}

export default class Ok<a> implements OkDecoder<a> {
  type: "Ok" = "Ok"
  value: a
  static read({ value }: OkDecoder<a>, input: mixed): Decode<a> {
    return value
  }
}
