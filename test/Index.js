/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.index", async test => {
  test.deepEqual(Decoder.index(0, Decoder.Integer), {
    type: "Index",
    index: 0,
    member: Decoder.Integer
  })

  test.deepEqual(Decoder.index(0, Decoder.index(2, Decoder.String)), {
    type: "Index",
    index: 0,
    member: {
      type: "Index",
      index: 2,
      member: Decoder.String
    }
  })
})

testDecode(
  {
    "Decoder.index(0, Decoder.Integer)": Decoder.index(0, Decoder.Integer),
    '{type:"Index",index:0,member:{type:"Integer"}}': ({
      type: "Index",
      index: 0,
      member: { type: "Integer" }
    }: any)
  },
  {
    "[7]": Result.ok(7),
    "[1.1,2,3,4]": Result.error(
      "Expecting an Integer at input[0] but instead got: `1.1`"
    ),
    "[]": Result.error("Expecting a longer (>=1) array but instead got: `[]`"),
    '["foo"]': Result.error(
      `Expecting an Integer at input[0] but instead got: \`"foo"\``
    ),
    "[true]": Result.error(
      `Expecting an Integer at input[0] but instead got: \`true\``
    ),
    "[false]": Result.error(
      `Expecting an Integer at input[0] but instead got: \`false\``
    ),
    '[["a","b","c","d"]]': Result.error(
      'Expecting an Integer at input[0] but instead got: `["a","b","c","d"]`'
    )
  },
  key => Result.error(`Expecting an array but instead got: \`${key}\``)
)

testDecode(
  {
    "Decoder.index(3, Decoder.Float)": Decoder.index(3, Decoder.Float),
    '{type:"Index",index:3,member:{type:"Float"}}': ({
      type: "Index",
      index: 3,
      member: { type: "Float" }
    }: any)
  },
  {
    "[7]": Result.error(
      "Expecting a longer (>=4) array but instead got: `[7]`"
    ),
    "[1.1,2,3,4]": Result.ok(4),
    "[]": Result.error("Expecting a longer (>=4) array but instead got: `[]`"),
    '["foo"]': Result.error(
      'Expecting a longer (>=4) array but instead got: `["foo"]`'
    ),
    "[true]": Result.error(
      "Expecting a longer (>=4) array but instead got: `[true]`"
    ),
    "[false]": Result.error(
      "Expecting a longer (>=4) array but instead got: `[false]`"
    ),
    '[["a","b","c","d"]]': Result.error(
      'Expecting a longer (>=4) array but instead got: `[["a","b","c","d"]]`'
    )
  },
  key => Result.error(`Expecting an array but instead got: \`${key}\``)
)

testDecode(
  {
    "Decoder.index(0, Decoder.index(3, Decoder.String))": Decoder.index(
      0,
      Decoder.index(3, Decoder.String)
    ),
    '{type:"Index",index:0,member:{type:"Index",index:3,member:{type:"String"}}}': ({
      type: "Index",
      index: 0,
      member: { type: "Index", index: 3, member: { type: "String" } }
    }: any)
  },
  {
    "[]": Result.error("Expecting a longer (>=1) array but instead got: `[]`"),
    "[7]": Result.error("Expecting an array at input[0] but instead got: `7`"),
    "[1.1,2,3,4]": Result.error(
      "Expecting an array at input[0] but instead got: `1.1`"
    ),
    '["foo"]': Result.error(
      'Expecting an array at input[0] but instead got: `"foo"`'
    ),
    "[true]": Result.error(
      "Expecting an array at input[0] but instead got: `true`"
    ),
    "[false]": Result.error(
      "Expecting an array at input[0] but instead got: `false`"
    ),
    '[["a","b","c","d"]]': Result.ok("d")
  },
  key => Result.error(`Expecting an array but instead got: \`${key}\``)
)
