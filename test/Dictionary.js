/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.dictionary", async test => {
  test.deepEqual(Decoder.dictionary(Decoder.Integer), {
    type: "Dictionary",
    dictionary: { type: "Integer" }
  })
})

testDecode(
  {
    "Decoder.dictionary(Decoder.Integer)": Decoder.dictionary(Decoder.Integer),
    '{"type":"Dictionary","dictionary":{"type":"Integer"}}': ({
      type: "Dictionary",
      dictionary: { type: "Integer" }
    }: any)
  },
  {
    "{}": Result.ok({}),
    '{"a":2}': Result.ok({ a: 2 }),
    '{"b":{"c":4.3}}': Result.error(
      'Expecting an Integer at input["b"] but instead got: `{"c":4.3}`'
    ),
    '{"a":"A","b":{"c":{"d":4}}}': Result.error(
      'Expecting an Integer at input["a"] but instead got: `"A"`'
    ),
    'new String("Hello")': Result.error(
      'Expecting an Integer at input["0"] but instead got: `"H"`'
    ),
    'new String("")': Result.ok({}),
    "new Number(-9.8)": Result.ok({}),
    "new Number(0.2)": Result.ok({}),
    "new Number(15)": Result.ok({}),
    "new Number(-15)": Result.ok({}),
    "new Number(0)": Result.ok({}),
    "new Boolean(true)": Result.ok({}),
    "new Boolean(false)": Result.ok({}),
    '{"fn":true,"v":1}': Result.error(
      'Expecting an Integer at input["fn"] but instead got: `true`'
    ),
    '{"fn":true,"v":2}': Result.error(
      'Expecting an Integer at input["fn"] but instead got: `true`'
    )
  },
  key => Result.error(`Expecting an object but instead got: \`${key}\``)
)
