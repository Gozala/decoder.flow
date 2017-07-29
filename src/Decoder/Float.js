/* @flow */

import type { Decoder, Decode } from "./Decoder"
import Read from "../Reader/Read"
import { TypeError } from "./Error"

// babel-preset-flow@^6.23.0 does not support flow opaque type aliases
// (See https://github.com/babel/babel/pull/5990)
// There for we use flow comments to workaround that for now.
/*::
export opaque type float:number = number
*/

export interface FloatDecoder <a> {
  type:"Float"
}

const read = Read((decoder:Decoder<float>, input:mixed):Decode<float> => {
  // Note that if `Number.isFinite(x)` returns `true` we know that `x` is a
  // finite number, but flow can't infer it there for we trick flow into
  // thinking that we also check typeof input === "number" so it will narrow
  // the type down to number
  if (Number.isFinite(input)/*:: && typeof input === "number"*/) {
    return input
  } else {
    return new TypeError("Float", input)
  }
})

export default class Float implements FloatDecoder <float> {
  static read = read
  type:"Float" = "Float"
}