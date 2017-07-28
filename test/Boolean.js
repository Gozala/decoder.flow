/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.Boolean shape", async test => {
  test.deepEqual(Decoder.Boolean, { type: "Boolean" })
})

testDecode(
  {
    "Decoder.Boolean": Decoder.Boolean,
    '{type:"Boolean"}': { type: "Boolean" }
  },
  {
    true: Result.ok(true),
    false: Result.ok(false)
  },
  key => Result.error(`Expecting a Boolean but instead got: \`${key}\``)
)
