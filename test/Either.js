/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.either", async test => {
  const decoder = Decoder.either(Decoder.String, Decoder.annul(""))

  test.deepEqual(decoder, {
    type: "Either",
    either: [{ type: "String" }, { type: "Null", Null: "" }]
  })
})

testDecode(
  {
    'Decoder.either(Decoder.String, Decoder.annul(""))': Decoder.either(
      Decoder.String,
      Decoder.annul("")
    ),
    '{type:"Either",either:[{type:"String"},{type:"Null",Null:""}]}': ({
      type: "Either",
      either: [{ type: "String" }, { type: "Null", Null: "" }]
    }: any)
  },
  {
    null: Result.ok(""),
    '""': Result.ok(""),
    'new String("")': Result.ok(""),
    '"hello"': Result.ok("hello"),
    'new String("Hello")': Result.ok("Hello")
  },
  key =>
    Result.error(
      `Ran into the following problems:\n\nExpecting a String but instead got: \`${key}\`\nExpecting a null but instead got: \`${key}\``
    )
)

test("Decoder.either from readme", async test => {
  const badName = Decoder.either(Decoder.String, Decoder.annul(""))
  test.deepEqual(
    Decoder.decode(Decoder.array(badName), ["alice", "bob", null, "chuck"]),
    Result.ok(["alice", "bob", "", "chuck"])
  )
})
