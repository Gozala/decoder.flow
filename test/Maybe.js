/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.maybe", async test => {
  test.deepEqual(
    Decoder.maybe(Decoder.Integer),
    {
      type: "Maybe",
      maybe: Decoder.Integer
    },
    `Decoder.maybe(Decoder.Integer) : {type:Decoder.Type.Maybe, decoder:Decoder.Integer}`
  )
})

testDecode(
  {
    "Decoder.maybe(Decoder.Integer)": Decoder.maybe(Decoder.Integer),
    '{type: "Maybe",maybe:{type:"Integer"}}': ({
      type: "Maybe",
      maybe: { type: "Integer" }
    }: any)
  },
  {
    "0": Result.ok(0),
    "-15": Result.ok(-15),
    "15": Result.ok(15)
  },
  key => Result.ok(null)
)
