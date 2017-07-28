/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.field", async test => {
  test.deepEqual(
    Decoder.field("a", Decoder.Integer),
    {
      type: "Field",
      name: "a",
      field: Decoder.Integer
    },
    'Decoder.field("a", Decoder.Integer)'
  )

  test.deepEqual(
    Decoder.field("b", Decoder.field("c", Decoder.Float)),
    {
      type: "Field",
      name: "b",
      field: {
        type: "Field",
        name: "c",
        field: Decoder.Float
      }
    },
    'Decoder.field("b", Decoder.field("c", Decoder.Float))'
  )
})

testDecode(
  {
    'Decoder.field("a", Decoder.Integer)': Decoder.field("a", Decoder.Integer),
    '{type:"Field",name:"a",field:{type:"Integer"}}': ({
      type: "Field",
      name: "a",
      field: { type: "Integer" }
    }: any)
  },
  {
    '{"a":2}': Result.ok(2),
    '{"a":"A","b":{"c":{"d":4}}}': Result.error(
      'Expecting an Integer at input["a"] but instead got: `"A"`'
    )
  },
  key =>
    Result.error(
      `Expecting an object with a field named \'a\' but instead got: \`${key}\``
    )
)

testDecode(
  {
    'Decoder.field("b", Decoder.field("c", Decoder.Float))': Decoder.field(
      "b",
      Decoder.field("c", Decoder.Float)
    ),
    '{type:"Field",name:"b",field:{type: "Field",name:"c",field:{type:"Float"}}}': ({
      type: "Field",
      name: "b",
      field: {
        type: "Field",
        name: "c",
        field: { type: "Float" }
      }
    }: any)
  },
  {
    '{"b":{"c":4.3}}': Result.ok(4.3),
    '{"a":"A","b":{"c":{"d":4}}}': Result.error(
      'Expecting a Float at input["b"]["c"] but instead got: `{"d":4}`'
    )
  },
  key =>
    Result.error(
      `Expecting an object with a field named \'b\' but instead got: \`${key}\``
    )
)
