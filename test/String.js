/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.String", async test => {
  test.deepEqual(Decoder.String, { type: "String" })
})

testDecode(
  {
    "Decoder.String": Decoder.String,
    '{type:"String"}': { type: "String" }
  },
  {
    '""': Result.ok(""),
    'new String("")': Result.ok(""),
    '"hello"': Result.ok("hello"),
    'new String("Hello")': Result.ok("Hello")
  },
  key => Result.error(`Expecting a String but instead got: \`${key}\``)
)
