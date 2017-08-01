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
    null: Result.error("Expecting an Integer but instead got: `null`"),
    undefined: Result.error(
      "Expecting an Integer but instead got: `undefined`"
    ),
    "0": Result.ok(0),
    "-15": Result.ok(-15),
    "15": Result.ok(15)
  },
  key => Result.ok(null)
)

test("Readme", async test => {
  const tom = { name: "tom", age: 42 }
  test.deepEqual(
    Decoder.decode(Decoder.maybe(Decoder.field("age", Decoder.Integer)), tom),
    Result.ok(42)
  )

  test.deepEqual(
    Decoder.decode(Decoder.maybe(Decoder.field("name", Decoder.Integer)), tom),
    Result.ok(null)
  )

  test.deepEqual(
    Decoder.decode(Decoder.maybe(Decoder.field("height", Decoder.Float)), tom),
    Result.ok(null)
  )

  test.deepEqual(
    Decoder.decode(Decoder.field("age", Decoder.maybe(Decoder.Integer)), tom),
    Result.ok(42)
  )
  test.deepEqual(
    Decoder.decode(Decoder.field("name", Decoder.maybe(Decoder.Integer)), tom),
    Result.ok(null)
  )
  test.deepEqual(
    Decoder.decode(
      Decoder.field("height", Decoder.maybe(Decoder.Integer)),
      tom
    ).format(x => x.message),
    Result.error(
      'Expecting an object with a field named \'height\' but instead got: `{"name":"tom","age":42}`'
    )
  )
})
