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

test("Decoder.error from readme", async test => {
  test.deepEqual(
    Decoder.decode(Decoder.error("Boom!"), true).format(x => x.message),
    Result.error("Boom!")
  )
  test.deepEqual(
    Decoder.decode(Decoder.error("Boom!"), [1, 2, 3]).format(x => x.message),
    Result.error("Boom!")
  )
  test.deepEqual(
    Decoder.decode(Decoder.error("Boom!"), "hello").format(x => x.message),
    Result.error("Boom!")
  )

  const phone = Decoder.either(
    Decoder.field("cell", Decoder.String),
    Decoder.field("home", Decoder.String),
    Decoder.error("No phone number")
  )

  test.deepEqual(
    Decoder.decode(phone, { cell: "415-5588-0000", home: "415-8855-0000" }),
    Result.ok("415-5588-0000")
  )
  test.deepEqual(
    Decoder.decode(phone, { home: "415-8855-0000" }),
    Result.ok("415-8855-0000")
  )
  test.deepEqual(
    Decoder.decode(phone, {}).format(x => x.message),
    Result.error(`Ran into the following problems:

Expecting an object with a field named 'cell' but instead got: \`{}\`
Expecting an object with a field named 'home' but instead got: \`{}\`
No phone number`)
  )
})
