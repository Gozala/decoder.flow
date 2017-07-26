/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { BadPrimitive, BadField, BadAccessor, Error } from "./Error"
import * as decoder from "./Decoder"

export interface AccessorDecoder<a> {
  type: "Accessor",
  name: string,
  accessor: Decoder<a>
}

export default class AccessorCodec<a> implements AccessorDecoder<a> {
  type: "Accessor" = "Accessor"
  name: string
  accessor: Decoder<a>
  static decode(input: mixed, codec: AccessorDecoder<a>): Decode<a> {
    const { name, accessor } = codec
    if (typeof input === "object" && input != null && name in input) {
      const object: Object = input
      try {
        const value = object[name]()
        const data = decoder.decode(value, accessor)
        if (data instanceof Error) {
          return new BadField(name, data)
        } else {
          return data
        }
      } catch (error) {
        return new BadAccessor(name, error)
      }
    } else {
      return new BadPrimitive(`an object with a field named '${name}'`, input)
    }
  }
}
