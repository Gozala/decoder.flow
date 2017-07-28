/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.either", async test => {
  const stringOrInt = Decoder.either(Decoder.String, Decoder.Integer)

  test.deepEqual(stringOrInt, {
    type: "Either",
    either: [{ type: "String" }, { type: "Integer" }]
  })
})

testDecode(
  {
    "Decoder.either(Decoder.String, Decoder.Integer)": Decoder.either(
      Decoder.String,
      Decoder.Integer
    ),
    '{type:"Either",either:[{type:"String"},{type:"Integer"}]}': ({
      type: "Either",
      either: [{ type: "String" }, { type: "Integer" }]
    }: any)
  },
  {
    '""': Result.ok(""),
    "0": Result.ok(0),
    'new String("")': Result.ok(""),
    '"hello"': Result.ok("hello"),
    'new String("Hello")': Result.ok("Hello"),
    "-15": Result.ok(-15),
    "15": Result.ok(15)
  },
  key =>
    Result.error(
      `Ran into the following problems:\n\nExpecting a String but instead got: \`${key}\`\nExpecting an Integer but instead got: \`${key}\``
    )
)
