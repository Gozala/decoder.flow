/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import assert from "./Decoder/Decoder"

test("Decoder.accessor", async test => {
  test.deepEqual(Decoder.accessor("invoke", Decoder.Float), {
    type: "Accessor",
    name: "invoke",
    accessor: Decoder.Float
  })
})

assert(
  {
    'Decoder.accessor("invoke", Decoder.Integer)': Decoder.accessor(
      "invoke",
      Decoder.Integer
    ),
    ' {"type":"Accessor","name":"invoke","accessor":{"type":"Integer"}}': ({
      type: "Accessor",
      name: "invoke",
      accessor: { type: "Integer" }
    }: any)
  },
  {
    '{"fn":true,"v":1}': Result.ok(2),
    '{"fn":true,"v":2}': Result.error(
      'Expecting an Integer at input["invoke"]() but instead got: `2.2`'
    )
  },
  key =>
    Result.error(
      `Expecting an object with a method named 'invoke' but instead got: \`${key}\``
    )
)

test("not a method", async test => {
  test.deepEqual(
    Decoder.decode(Decoder.accessor("invoke", Decoder.Float), {
      invoke: {}
    }).format(error => error.message),
    Result.error(
      'Expecting a function at input["invoke"] but instead got: `{}`'
    ),
    'Decoder.decode(Decoder.accessor("invoke", Decoder.Float), {invoke: {}})'
  )
})

test("throws", async test => {
  test.deepEqual(
    Decoder.decode(Decoder.accessor("invoke", Decoder.Float), {
      invoke() {
        throw Error("Boom!")
      }
    }).format(error => error.message),
    Result.error('An exception was thrown by input["invoke"](): Boom!'),
    'Decoder.accessor("invoke", Decoder.Float), {invoke() {throw Error("Boom!")}})'
  )
})
