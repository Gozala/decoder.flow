/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import assert from "./Decoder/Decoder"

test("Decoder.array", async test => {
  test.deepEqual(Decoder.array(Decoder.Float), {
    type: "Array",
    array: { type: "Float" }
  })
})

assert(
  {
    "Decoder.array(Decoder.Float)": Decoder.array(Decoder.Float),
    '{"type":"Array","array":{"type":"Float"}}': ({
      type: "Array",
      array: { type: "Float" }
    }: any)
  },
  {
    "[]": Result.ok([]),
    "[7]": Result.ok([7]),
    '["foo"]': Result.error(
      'Expecting a Float at input[0] but instead got: `"foo"`'
    ),
    "[true]": Result.error(
      "Expecting a Float at input[0] but instead got: `true`"
    ),
    "[false]": Result.error(
      "Expecting a Float at input[0] but instead got: `false`"
    ),
    "[1.1,2,3,4]": Result.ok([1.1, 2, 3, 4]),
    '[["a","b","c","d"]]': Result.error(
      'Expecting a Float at input[0] but instead got: `["a","b","c","d"]`'
    )
  },
  key => Result.error(`Expecting an Array but instead got: \`${key}\``)
)
