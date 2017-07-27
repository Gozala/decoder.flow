/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { BadPrimitive, BadField, Error } from "./Error"
import * as decoder from "./Decoder"
import Codec from "./Codec"

export type Dictionary<a> = { [string]: a }

export interface DictionaryDecoder<a> {
  type: "Dictionary",
  valueDecoder: Decoder<a>
}

const decode = Codec(<a>(input: mixed, self: DictionaryDecoder<a>): Decode<
  Dictionary<a>
> => {
  const { valueDecoder } = self
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return new BadPrimitive("an object", input)
  } else {
    const dictionary = Object.create(null)
    for (let key in input) {
      const data = decoder.decode(input[key], valueDecoder)
      if (data instanceof Error) {
        return new BadField(key, data)
      } else {
        dictionary[key] = data
      }
    }
    return dictionary
  }
})

export default class DictionaryCodec<a> implements DictionaryDecoder<a> {
  type: "Dictionary" = "Dictionary"
  valueDecoder: Decoder<a>
  constructor(decoder: Decoder<a>) {
    this.valueDecoder = decoder
  }
  static decode = decode
}
