/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.annul", async test => {
  test.deepEqual(Decoder.annul(0), {
    type: "Null",
    Null: 0
  })
})

testDecode(
  {
    "Decoder.annul(0)": Decoder.annul(0),
    '{type:"Null",Null:0}': ({ type: "Null", Null: 0 }: Object)
  },
  {
    null: Result.ok(0)
  },
  key => Result.error(`Expecting a null but instead got: \`${key}\``)
)
