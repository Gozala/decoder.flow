/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.Integer", async test => {
  test.deepEqual(Decoder.Integer, { type: "Integer" })
})

testDecode(
  {
    "Decoder.Integer": Decoder.Integer,
    '{type: "Integer"}': { type: "Integer" }
  },
  {
    "0": Result.ok(0),
    "-15": Result.ok(-15),
    "15": Result.ok(15)
  },
  key => Result.error(`Expecting an Integer but instead got: \`${key}\``)
)

test("Decoder.toInteger", async test => {
  test.equal(Decoder.toInteger(9.99999), 9)
  test.equal(Decoder.toInteger(9.00001), 9)
  test.equal(Decoder.toInteger(0), 0)
  test.equal(Decoder.toInteger(0.1), 0)
  test.equal(Decoder.toInteger(-98), -98)
  test.equal(Decoder.toInteger(-98.989), -98)
  test.equal(Decoder.toInteger(-98.0000001), -98)
  test.equal(Decoder.toInteger(NaN), 0)
  test.equal(Decoder.toInteger(Infinity), Number.MAX_SAFE_INTEGER)
  test.equal(Decoder.toInteger(+Infinity), Number.MAX_SAFE_INTEGER)
  test.equal(Decoder.toInteger(-Infinity), Number.MIN_SAFE_INTEGER)
  test.equal(Decoder.toInteger(10 / 0), Number.MAX_SAFE_INTEGER)
})
