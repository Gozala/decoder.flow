/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.ok", async test => {
  test.deepEqual(Decoder.ok(42), { type: "Ok", value: 42 })
})

testDecode(
  {
    "Decoder.ok(42)": Decoder.ok(42),
    '{type:"Ok",value:42}': { type: "Ok", value: 42 }
  },
  {},
  _ => Result.ok(42)
)

test("Decoder.ok from readme", async test => {
  test.deepEqual(Decoder.decode(Decoder.ok(42), true), Result.ok(42))
  test.deepEqual(Decoder.decode(Decoder.ok(42), [1, 2, 3]), Result.ok(42))
  test.deepEqual(Decoder.decode(Decoder.ok(42), "hello"), Result.ok(42))

  const name = Decoder.either(
    Decoder.field("username", Decoder.String),
    Decoder.field("email", Decoder.String),
    Decoder.ok("stranger")
  )
  test.deepEqual(Decoder.decode(name, { username: "Jack" }), Result.ok("Jack"))
  test.deepEqual(
    Decoder.decode(name, { email: "jack@email.com" }),
    Result.ok("jack@email.com")
  )
  test.deepEqual(Decoder.decode(name, {}), Result.ok("stranger"))
})
