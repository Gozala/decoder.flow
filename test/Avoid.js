/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.avoid", async test => {
  test.deepEqual(Decoder.avoid(0), {
    type: "Undefined",
    Undefined: 0
  })
})

testDecode(
  {
    "Decoder.avoid(0)": Decoder.avoid(0),
    '{type:"Undefined",Undefined:0}': ({
      type: "Undefined",
      Undefined: 0
    }: Object)
  },
  {
    undefined: Result.ok(0)
  },
  key => Result.error(`Expecting an undefined but instead got: \`${key}\``)
)
