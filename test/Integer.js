/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.Integer", async test => {
  test.deepEqual(Decoder.Integer, { type: "Integer" })
})

testDecode(
  {
    "Decoder.Integer": Decoder.Integer,
    '{type: "Integer"}': { type: "Integer" }
  },
  {
    "0": Result.ok(0),
    "-15": Result.ok(-15),
    "15": Result.ok(15)
  },
  key => Result.error(`Expecting an Integer but instead got: \`${key}\``)
)
