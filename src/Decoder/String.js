/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { TypeError } from "./Error"
import Read from "../Reader/Read"

const StringConstructor = "".constructor

export interface StringDecoder<a> {
  type: "String"
}

const read = Read((_: Decoder<string>, input: mixed): Decode<string> => {
  if (typeof input === "string") {
    return input
  } else if (input instanceof StringConstructor) {
    return `${input}`
  } else {
    return new TypeError("String", input)
  }
})

export default class String implements StringDecoder<string> {
  type: "String" = "String"
  static read = read
}
