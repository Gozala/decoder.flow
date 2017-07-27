/* @flow */

import type { Decoder, Decode } from "./Decoder"
import Codec from "./Codec"
import { BadPrimitive } from "./Error"

// babel-preset-flow@^6.23.0 does not support flow opaque type aliases
// (See https://github.com/babel/babel/pull/5990)
// There for we use flow comments to workaround that for now.
/*::
export opaque type float:number = number
*/

export interface FloatDecoder <a> {
  type:"Float"
}

const decode = Codec((input:mixed, decoder:Decoder<float>):Decode<float> => {
  // Note that if `Number.isFinite(x)` returns `true` we know that `x` is a
  // finite number, but flow can't infer it there for we trick flow into
  // thinking that we also check typeof input === "number" so it will narrow
  // the type down to number
  if (Number.isFinite(input)/*:: && typeof input === "number"*/) {
    return input
  } else {
    return new BadPrimitive("a Float", input)
  }
})

export default class Float implements FloatDecoder <float> {
  static decode = decode
  type:"Float" = "Float"
}