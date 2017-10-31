/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { TypeError, ThrownError, Error } from "./Error"
import { FieldError } from "./Field"
import * as Reader from "../Reader"

export type Dictionary<a> = { [string]: a }

export interface DictionaryDecoder<a> {
  type: "Dictionary";
  dictionary: Decoder<a>;
}

export default class DictionaryReader<a> implements DictionaryDecoder<a> {
  type: "Dictionary" = "Dictionary"
  dictionary: Decoder<a>
  constructor(decoder: Decoder<a>) {
    this.dictionary = decoder
  }
  static read<a>(
    self: DictionaryDecoder<a>,
    input: mixed
  ): Decode<Dictionary<a>> {
    const valueDecoder = self.dictionary
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
      return new TypeError("object", input)
    } else {
      const dictionary: Dictionary<a> = (Object.create(null): Object)
      for (let key in input) {
        try {
          const value = Reader.read(valueDecoder, input[key])
          if (value instanceof Error) {
            return new FieldError(key, value)
          } else {
            dictionary[key] = value
          }
        } catch (error) {
          return new FieldError(key, new ThrownError(error))
        }
      }
      return dictionary
    }
  }
}
