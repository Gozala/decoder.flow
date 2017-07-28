/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.at", async test => {
  test.deepEqual(
    Decoder.at(["a"], Decoder.Integer),
    {
      type: "Field",
      name: "a",
      field: Decoder.Integer
    },
    'Decoder.at(["a"], Decoder.Integer)'
  )

  test.deepEqual(
    Decoder.at(["b", "c"], Decoder.Integer),
    {
      type: "Field",
      name: "b",
      field: {
        type: "Field",
        name: "c",
        field: Decoder.Integer
      }
    },
    'Decoder.at(["b", "c"], Decoder.Integer)'
  )
})

testDecode(
  {
    'Decoder.at(["a"], Decoder.Integer)': Decoder.at(["a"], Decoder.Integer),
    '{type: "Field",name: "a",field:{type:"Integer"}}': ({
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
    'Decoder.at(["b", "c"], Decoder.Float)': Decoder.at(
      ["b", "c"],
      Decoder.Float
    ),
    '{type:"Field",name:"b",field:{type:"Field",name:"c",field:{type:"Float"}}}': ({
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
