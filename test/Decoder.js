/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"

test("test exports", async test => {
  test.deepEqual(typeof Decoder, "object")
  test.deepEqual(typeof Decoder.decode, "function")
  test.deepEqual(typeof Decoder.parse, "function")

  test.deepEqual(typeof Decoder.String, "object")
  test.deepEqual(typeof Decoder.Boolean, "object")
  test.deepEqual(typeof Decoder.Integer, "object")
  test.deepEqual(typeof Decoder.toInteger, "function")
  test.deepEqual(typeof Decoder.Float, "object")
  test.deepEqual(typeof Decoder.toFloat, "function")

  test.deepEqual(typeof Decoder.error, "function")
  test.deepEqual(typeof Decoder.field, "function")
  test.deepEqual(typeof Decoder.index, "function")
  test.deepEqual(typeof Decoder.at, "function")
  test.deepEqual(typeof Decoder.accessor, "function")
  test.deepEqual(typeof Decoder.either, "function")
  test.deepEqual(typeof Decoder.array, "function")
  test.deepEqual(typeof Decoder.dictionary, "function")
  test.deepEqual(typeof Decoder.optional, "function")
  test.deepEqual(typeof Decoder.maybe, "function")
  test.deepEqual(typeof Decoder.record, "function")
  test.deepEqual(typeof Decoder.form, "function")
  test.deepEqual(typeof Decoder.annul, "function")
  test.deepEqual(typeof Decoder.avoid, "function")
})
