/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.error", async test => {
  test.deepEqual(Decoder.error("Boom!").type, "Error")
  test.deepEqual(JSON.parse(JSON.stringify(Decoder.error("Boom!"))), {
    type: "Error",
    message: "Boom!"
  })
})

testDecode(
  {
    'Decoder.error("Boom!")': Decoder.error("Boom!"),
    '{type:"Error",message:"Boom!"}': { type: "Error", message: "Boom!" }
  },
  {},
  _ => Result.error(`Boom!`)
)
