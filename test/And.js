/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.and", async test => {
  test.deepEqual(
    Decoder.and(
      Decoder.match({ keyCode: 13 }),
      Decoder.field("value", Decoder.String)
    ),
    {
      type: "And",
      left: {
        type: "Match",
        match: {
          keyCode: 13
        }
      },
      right: {
        type: "Field",
        name: "value",
        field: { type: "String" }
      }
    },
    'Decoder.and(Decoder.match({keyCode:13}), Decoder.field("value", Decoder.String))'
  )
})

testDecode(
  {
    'Decoder.and(Decoder.match({}), Decoder.field("length", Decoder.Integer))': Decoder.and(
      Decoder.match({}),
      Decoder.field("length", Decoder.Integer)
    ),
    '{type:"And", left:{type:"Match", match:{}}, right:{type:"Field", name:"length", field:{type:"Integer"}}}': {
      type: "And",
      left: { type: "Match", match: {} },
      right: { type: "Field", name: "length", field: { type: "Integer" } }
    }
  },
  {
    "[]": Result.ok(0),
    "[7]": Result.ok(1),
    '["foo"]': Result.ok(1),
    "[true]": Result.ok(1),
    "[false]": Result.ok(1),
    "[1.1,2,3,4]": Result.ok(4),
    '[["a","b","c","d"]]': Result.ok(1),
    'new String("")': Result.ok(0),
    'new String("Hello")': Result.ok(5)
  },
  key =>
    key.startsWith("{") || key.startsWith("new")
      ? Result.error(
          `Expecting an object with a field named \'length\' but instead got: \`${
            key
          }\``
        )
      : Result.error(`Expecting \`{}\` but instead got: \`${key}\``)
)
