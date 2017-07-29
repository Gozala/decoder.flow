/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { TypeError } from "./Error"
import Read from "../Reader/Read"

export interface BooleanDecoder<a> {
  type: "Boolean"
}

const read = Read((_: Decoder<boolean>, input: mixed): Decode<boolean> => {
  if (input === true) {
    return (true: any)
  } else if (input === false) {
    return (false: any)
  } else {
    return new TypeError("Boolean", input)
  }
})

export default class Boolean implements BooleanDecoder<boolean> {
  static read = read
  type: "Boolean" = "Boolean"
}
