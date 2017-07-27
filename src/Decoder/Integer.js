/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { BadPrimitive } from "./Error"
import Codec from "./Codec"

// babel-preset-flow@^6.23.0 does not support flow opaque type aliases
// (See https://github.com/babel/babel/pull/5990)
// There for we use flow comments to workaround that for now.
/*::
export opaque type integer:number = number
*/

export interface IntegerDecoder <a> {
  type: "Integer"
}

const decode = Codec((input:mixed, decoder:Decoder<integer>):Decode<integer> => {
  // Note that if `Number.isInteger(x)` returns `true` we know that `x` is an
  // integer number, but flow can not infer that, there for we trick flow into
  // thinking we also perform typeof input === "number" so it can narrow down
  // type to a number.
  if (Number.isInteger(input) /*:: && typeof input === "number"*/) {
    return input
  } else {
    return new BadPrimitive("an Integer", input)
  }
})

export default class Integer implements IntegerDecoder <integer> {
  static decode = decode
  type:"Integer" = "Integer"
}