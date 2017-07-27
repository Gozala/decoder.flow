/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { BadPrimitive, BadField, Error } from "./Error"
import * as decoder from "./Decoder"

export interface FieldDecoder<a> {
  type: "Field",
  name: string,
  field: Decoder<a>
}

export default class Field<a> implements FieldDecoder<a> {
  type: "Field" = "Field"
  name: string
  field: Decoder<a>
  constructor(name: string, field: Decoder<a>) {
    this.name = name
    this.field = field
  }
  static decode(input: mixed, { name, field }: FieldDecoder<a>): Decode<a> {
    if (typeof input !== "object" || input === null || !(name in input)) {
      return new BadPrimitive(`an object with a field named '${name}'`, input)
    } else {
      const value = decoder.decode(input[name], field)
      if (value instanceof Error) {
        return new BadField(name, value)
      } else {
        return value
      }
    }
  }
}
