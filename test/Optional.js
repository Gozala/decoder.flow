/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.optional", async test => {
  test.deepEqual(Decoder.optional(Decoder.Integer), {
    type: "Optional",
    optional: {
      type: "Integer"
    }
  })
})

testDecode(
  {
    "Decoder.optional(Decoder.Integer)": Decoder.optional(Decoder.Integer),
    '{type:"Optional",optional:{type:"Integer"}}': ({
      type: "Optional",
      optional: { type: "Integer" }
    }: Object)
  },
  {
    null: Result.ok(null),
    undefined: Result.ok(null),
    "0": Result.ok(0),
    "-15": Result.ok(-15),
    "15": Result.ok(15)
  },
  key => Result.error(`Expecting an Integer but instead got: \`${key}\``)
)
