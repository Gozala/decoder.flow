/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.record", async test => {
  test.deepEqual(
    Decoder.record({ x: Decoder.Float, y: Decoder.Float }),
    {
      type: "Record",
      fields: { x: { type: "Float" }, y: { type: "Float" } }
    },
    "Decoder.record({x:Decoder.Float,y:Decoder.Float})"
  )

  test.deepEqual(
    Decoder.record({}),
    {
      type: "Record",
      fields: {}
    },
    "Decoder.record({})"
  )
})

const error = Result.error(
  'Expecting a Float at input["x"] but instead got: `undefined`'
)

testDecode(
  {
    "Decoder.record({x:Decoder.Float,y:Decoder.Float})": Decoder.record({
      x: Decoder.Float,
      y: Decoder.Float
    }),
    '{"type":"Record","fields":{"x":{"type":"Float"},"y":{"type":"Float"}}}': ({
      type: "Record",
      fields: { x: { type: "Float" }, y: { type: "Float" } }
    }: any)
  },
  {
    "new Boolean(true)": error,
    "new Boolean(false)": error,
    "new Number(0)": error,
    "new Number(-15)": error,
    "new Number(15)": error,
    "new Number(0.2)": error,
    "new Number(-9.8)": error,
    "[]": error,
    "[7]": error,
    '["foo"]': error,
    "[true]": error,
    "[false]": error,
    "[1.1,2,3,4]": error,
    '[["a","b","c","d"]]': error,
    'new String("")': error,
    'new String("Hello")': error,
    "{}": error,
    '{"a":2}': error,
    '{"b":{"c":4.3}}': error,
    '{"a":"A","b":{"c":{"d":4}}}': error,
    '{"fn":true,"v":1}': error,
    '{"fn":true,"v":2}': error
  },
  key => Result.error(`Expecting an object but instead got: \`${key}\``)
)

// const ok = Result.ok({})

// testDecode(
//   {
//     "Decoder.record({})": Decoder.record({}),
//     '{type: "Record",fields: {}}': ({
//       type: "Record",
//       fields: {}
//     }: any)
//   },
//   {
//     "new Boolean(true)": ok,
//     "new Boolean(false)": ok,
//     "new Number(0)": ok,
//     "new Number(-15)": ok,
//     "new Number(15)": ok,
//     "new Number(0.2)": ok,
//     "new Number(-9.8)": ok,
//     "[]": ok,
//     "[7]": ok,
//     '["foo"]': ok,
//     "[true]": ok,
//     "[false]": ok,
//     "[1.1,2,3,4]": ok,
//     '[["a","b","c","d"]]': ok,
//     'new String("")': ok,
//     'new String("Hello")': ok,
//     "{}": ok,
//     '{"a":2}': ok,
//     '{"b":{"c":4.3}}': ok,
//     '{"a":"A","b":{"c":{"d":4}}}': ok,
//     '{"fn":true,"v":1}': ok,
//     '{"fn":true,"v":2}': ok
//   },
//   key => Result.error(`Expecting an object but instead got: \`${key}\``)
// )
