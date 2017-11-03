/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { Error, TypeError, ThrownError } from "./Error"
import { FieldError } from "./Field"
import * as Variant from "./Decoder"

export type Record<a> = Decoder<$ObjMap<a, <b>(Decoder<b>) => b>>
export type Fields<a> = $ObjMap<a, <b>(b) => Decoder<b>> & {
  [string]: Decoder<*>
}

export interface RecordDecoder<a> {
  type: "Record";
  fields: Fields<a>;
}

export default class RecordReader<a> implements RecordDecoder<a> {
  type: "Record" = "Record"
  fields: Fields<a>
  constructor(fields: Fields<a>) {
    this.fields = fields
  }
  static decode<a: {}>(fields: Fields<a>, input: mixed): Decode<a> {
    if (typeof input === "object" && input !== null) {
      const result: Object = {}
      for (let key of Object.keys(fields)) {
        try {
          const value = Variant.decode(fields[key], input[key])
          if (value instanceof Error) {
            return new FieldError(key, value)
          } else {
            result[key] = value
          }
        } catch (error) {
          return new FieldError(key, new ThrownError(error))
        }
      }
      return result
    } else {
      return new TypeError("object", input)
    }
  }
}
