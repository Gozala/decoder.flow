/* @flow */
// # Turn JSON values into Elm values. Definitely check out this intro to JSON decoders to get a feel for how this library works!

import * as Decoder from "decoder.flow"

// #Primitives

var _ = $ => {
  if ($) {
    if ($.isOk) {
      return `Result.Ok ${JSON.stringify($.value)}`
    } else if ($.isOk === false) {
      return `Result.Error ${$.error.message}`
    }
  }
  return $
}

// ### Decoder.String

Decoder.decode(Decoder.String, true) //?_($)
Decoder.decode(Decoder.String, 42) //?_($)
Decoder.decode(Decoder.String, "Hello") //?_($)
Decoder.decode(Decoder.String, { hello: 42 }) //?_($)

// ### Decoder.Boolean

Decoder.parse(Decoder.Boolean, "true") //?_($)
Decoder.decode(Decoder.Boolean, true) //?_($)
Decoder.parse(Decoder.Boolean, "42") //?_($)
Decoder.decode(Decoder.Boolean, 42) //?_($)
Decoder.parse(Decoder.Boolean, "3.14") //?_($)
Decoder.decode(Decoder.Boolean, 3.14) //?_($)
Decoder.parse(Decoder.Boolean, '"hello"') //?_($)
Decoder.decode(Decoder.Boolean, "hello") //?_($)
Decoder.parse(Decoder.Boolean, '{ "hello": 42 }') //?_($)
Decoder.decode(Decoder.Boolean, { hello: 42 }) //?_($)

// ### Decoder.Boolean

Decoder.decode(Decoder.Boolean, true) //?_($)
Decoder.decode(Decoder.Boolean, 42) //?_($)
Decoder.decode(Decoder.Boolean, 3.14) //?_($)
Decoder.decode(Decoder.Boolean, "hello") //?_($)
Decoder.decode(Decoder.Boolean, { hello: 42 }) //?_($)

// ### Decoder.Integer

Decoder.decode(Decoder.Integer, true) //?_($)
Decoder.decode(Decoder.Integer, 42) //?_($)
Decoder.decode(Decoder.Integer, 3.14) //?_($)
Decoder.decode(Decoder.Integer, "hello") //?_($)
Decoder.decode(Decoder.Integer, { hello: 42 }) //?_($)

// ### Decoder.Float

Decoder.decode(Decoder.Float, true) //?_($)
Decoder.decode(Decoder.Float, 42) //?_($)
Decoder.decode(Decoder.Float, 3.14) //?_($)
Decoder.decode(Decoder.Float, "hello") //?_($)
Decoder.decode(Decoder.Float, { hello: 42 }) //?_($)

// ### Decoder.maybe

Decoder.decode(Decoder.maybe(Decoder.Float), true) //?_($)
Decoder.decode(Decoder.maybe(Decoder.Float), 42) //?_($)
Decoder.decode(Decoder.maybe(Decoder.Float), 3.14) //?_($)
Decoder.decode(Decoder.maybe(Decoder.Float), "hello") //?_($)
Decoder.decode(Decoder.maybe(Decoder.Float), { hello: 42 }) //?_($)

// ### Decoder.array

Decoder.decode(Decoder.array(Decoder.Boolean), [true, false]) //?_($)
Decoder.decode(Decoder.array(Decoder.Float), [1, 2.2, 3]) //?_($)
Decoder.decode(Decoder.array(Decoder.Integer), [1, 2.2, 3]) //?_($)

// ### Decoder.dictionary

Decoder.decode(Decoder.dictionary(Decoder.Float), {
  alice: 42,
  bob: 99.8
}) //?_($)

Decoder.decode(Decoder.dictionary(Decoder.Integer), {
  alice: 42,
  bob: 99.8
}) //?_($)

// ### Decoder.field

Decoder.decode(Decoder.field("x", Decoder.Integer), { x: 3 }) //?_($)
Decoder.decode(Decoder.field("x", Decoder.Integer), { x: 3, y: 4 }) //?_($)
Decoder.decode(Decoder.field("x", Decoder.Integer), { x: true }) //?_($)
Decoder.decode(Decoder.field("x", Decoder.Integer), { y: 4 }) //?_($)
Decoder.decode(Decoder.field("x", Decoder.Integer), "x=3") //?_($)
Decoder.decode(Decoder.field("name", Decoder.String), { name: "Tom" }) //?_($)

// ### Decoder.at
const profile = { person: { name: "Tom", age: 42 } }
Decoder.decode(Decoder.at(["person", "name"], Decoder.String), profile) //?_($)
Decoder.decode(Decoder.at(["person", "age"], Decoder.Integer), profile) //?_($)

// same as

Decoder.decode(
  Decoder.field("person", Decoder.field("age", Decoder.Integer)),
  profile
) //?_($)

// ### Decoder.index

const users = ["alice", "bob", "chuck"]
Decoder.decode(Decoder.index(0, Decoder.String), users) //?_($)
Decoder.decode(Decoder.index(1, Decoder.String), users) //?_($)
Decoder.decode(Decoder.index(2, Decoder.String), users) //?_($)
Decoder.decode(Decoder.index(3, Decoder.String), users) //?_($)

// ### Decoder.optional

Decoder.decode(
  Decoder.field("name", Decoder.optional(Decoder.String, "User")),
  { name: null }
) //?_($)

// #### Decoder.either

const user = Decoder.either(
  Decoder.field("name", Decoder.String),
  Decoder.field("email", Decoder.String)
)

Decoder.decode(user, { name: "Jack" }) //?_($)
Decoder.decode(user, { email: "jack@web.com" }) //?_($)
Decoder.decode(user, { name: "Jack", email: "jack@web.com" }) //?_($)

// #### Decoder.record

const point = Decoder.record({
  x: Decoder.Integer,
  y: Decoder.Integer
})

Decoder.decode(point, { x: 3, y: 5 }) //?_($)
Decoder.decode(point, { x: 3, y: 5, z: 7 }) //?_($)
Decoder.decode(point, { x: 3, y: 5.2 }) //?_($)

const point3d = Decoder.record({
  x: Decoder.Integer,
  y: Decoder.Integer,
  z: Decoder.optional(Decoder.Integer, Decoder.toInteger(8))
})

Decoder.decode(point3d, { x: 3, y: 5 }) //?_($)
Decoder.decode(point3d, { x: 3, y: 5, z: 7 }) //?_($)
Decoder.decode(point3d, { x: 3, y: 5.2 }) //?_($)

// ### accessor

Decoder.decode(Decoder.accessor("cwd", Decoder.String), process) //?_($)

Decoder.decode(
  Decoder.form({
    title: Decoder.field("title", Decoder.String),
    cwd: Decoder.accessor("cwd", Decoder.String),
    architecture: Decoder.at(
      ["config", "variables", "host_arch"],
      Decoder.String
    ),
    heapUsed: Decoder.accessor(
      "memoryUsage",
      Decoder.field("heapUsed", Decoder.Integer)
    )
  }),
  process
) //?_($)

process //?
