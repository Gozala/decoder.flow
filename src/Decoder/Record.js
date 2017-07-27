/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { Error } from "./Error"
import * as decoder from "./Decoder"
import Codec from "./Codec"

export type Record<a> = Decoder<$ObjMap<a, <b>(Decoder<b>) => b>>
export type Fields<a> = $ObjMap<a, <b>(b) => Decoder<b>>

export interface RecordDecoder<a> {
  type: "Record",
  fields: Fields<a>
}

const decode = Codec(
  <a: {}>(input: mixed, { fields }: RecordDecoder<a>): Decode<a> => {
    const result: Object = {}
    for (let key of Object.keys(fields)) {
      const value = decoder.decode(input, fields[key])
      if (value instanceof Error) {
        return value
      } else {
        result[key] = value
      }
    }
    return result
  }
)

export default class RecordCodec<a: {}> implements RecordDecoder<a> {
  type: "Record" = "Record"
  fields: Fields<a>
  constructor(fields: Fields<a>) {
    this.fields = fields
  }
  static decode = decode
}
