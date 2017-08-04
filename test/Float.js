/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.Float", async test => {
  test.deepEqual(Decoder.Float, { type: "Float" })
})

testDecode(
  {
    "Decoder.Float": Decoder.Float,
    '{type: "Float"}': { type: "Float" }
  },
  {
    "0": Result.ok(0),
    "-15": Result.ok(-15),
    "15": Result.ok(15),
    "0.2": Result.ok(0.2),
    "-9.8": Result.ok(-9.8)
  },
  key => Result.error(`Expecting a Float but instead got: \`${key}\``)
)
