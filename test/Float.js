/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.Float", async test => {
  test.deepEqual(Decoder.Float, { type: "Float" })
})

testDecode(
  {
    "Decoder.Float": Decoder.Float,
    '{type: "Float"}': { type: "Float" }
  },
  {
    "0": Result.ok(0),
    "-15": Result.ok(-15),
    "15": Result.ok(15),
    "0.2": Result.ok(0.2),
    "-9.8": Result.ok(-9.8)
  },
  key => Result.error(`Expecting a Float but instead got: \`${key}\``)
)

test("Decoder.toFloat", async test => {
  test.equal(Decoder.toFloat(9.99999), 9.99999)
  test.equal(Decoder.toFloat(9.00001), 9.00001)
  test.equal(Decoder.toFloat(0), 0)
  test.equal(Decoder.toFloat(0.1), 0.1)
  test.equal(Decoder.toFloat(-98), -98)
  test.equal(Decoder.toFloat(-98.989), -98.989)
  test.equal(Decoder.toFloat(-98.0000001), -98.0000001)
  test.equal(Decoder.toFloat(NaN), 0)
  test.equal(Decoder.toFloat(Infinity), Number.MAX_VALUE)
  test.equal(Decoder.toFloat(+Infinity), Number.MAX_VALUE)
  test.equal(Decoder.toFloat(-Infinity), Number.MIN_VALUE)
  test.equal(Decoder.toFloat(10 / 0), Number.MAX_VALUE)
})
