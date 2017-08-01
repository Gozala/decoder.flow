/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { Error } from "./Error"
import * as Reader from "../Reader"
import Read from "../Reader/Read"

export interface OptionalDecoder<a> {
  type: "Optional",
  optional: Decoder<a>
}

const read = Read(<a>(self: OptionalDecoder<a>, input: mixed): Decode<?a> => {
  const value = Reader.read(self.optional, input)
  if (value instanceof Error) {
    if (input == null) {
      return null
    } else {
      return value
    }
  } else {
    return value
  }
})

export default class Optional<a> implements OptionalDecoder<a> {
  type: "Optional" = "Optional"
  optional: Decoder<a>
  static read = read
  constructor(decoder: Decoder<a>) {
    this.optional = decoder
  }
}
