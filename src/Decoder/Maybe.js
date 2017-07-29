/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { Error } from "./Error"
import * as Reader from "../Reader"
import Read from "../Reader/Read"

export interface MaybeDecoder<a> {
  type: "Maybe",
  maybe: Decoder<a>
}

const read = Read(<a>({ maybe }: MaybeDecoder<a>, input: mixed): Decode<?a> => {
  const value = Reader.read(maybe, input)
  if (value instanceof Error) {
    return null
  } else {
    return value
  }
})

export default class Maybe<a> implements MaybeDecoder<a> {
  type: "Maybe" = "Maybe"
  maybe: Decoder<a>
  static read = read
  constructor(decoder: Decoder<a>) {
    this.maybe = decoder
  }
}
