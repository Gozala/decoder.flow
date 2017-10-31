/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { Error } from "./Error"
import * as Reader from "../Reader"

export interface MaybeDecoder<a> {
  type: "Maybe";
  maybe: Decoder<a>;
}

export default class Maybe<a> implements MaybeDecoder<a> {
  type: "Maybe" = "Maybe"
  maybe: Decoder<a>
  constructor(decoder: Decoder<a>) {
    this.maybe = decoder
  }
  static read<a>({ maybe }: MaybeDecoder<a>, input: mixed): Decode<?a> {
    const value = Reader.read(maybe, input)
    if (value instanceof Error) {
      if (input == null) {
        return value
      } else {
        return null
      }
    } else {
      return value
    }
  }
}
