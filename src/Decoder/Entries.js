/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { BadPrimitive, BadField, Error } from "./Error"
import * as decoder from "./Decoder"
import Codec from "./Codec"

export type Entry<a> = [string, a]
export type Entries<a> = Array<Entry<a>>

export interface EntriesDecoder<a> {
  type: "Entries",
  entry: Decoder<a>
}

const decode = Codec(<a>(input: mixed, self: EntriesDecoder<a>): Decode<
  Entries<a>
> => {
  const { entry } = self
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return new BadPrimitive("an object", input)
  } else {
    const pairs = []
    for (let key in input) {
      const data = decoder.decode(input[key], entry)
      if (data instanceof Error) {
        return new BadField(key, data)
      } else {
        const pair = [key, data]
        pairs.push(pair)
      }
    }
    return pairs
  }
})

export default class EntriesCodec<a> implements EntriesDecoder<a> {
  type: "Entries" = "Entries"
  entry: Decoder<a>
  constructor(decoder: Decoder<a>) {
    this.entry = decoder
  }
  static decode = decode
}
