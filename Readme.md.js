/* @noflow */

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

// Library for turning arbitrary input into typed data. You can use this library to convert arbitrary JSON into nicely structured (and flow typed) data.

// ```js
// decode <a> (Decoder.Decoder<a>, input:mixed):Decoder.Result<a>
// ```

// It can also be used to put together structure data parsers that take strings of input and return typed data.

// ```js
// parse <a> (Decoder.Decoder<a>, input:string):Decoder.Result<a>
// ```

// The core concept in this library is a decoder. It decodes JSON values into typed values. Library provides some primitive decoders for handling primitive data types and some functions to put those together to form decoders that can handle more complex data.

// ### Import

// Rest of the the document & provided code examples assumes that library is installed & imported as follows:
// ```js
import * as Decoder from "decoder.flow"
// ```

// ### Primitive value decoders

// #### `Decoder.Decoder<a>`

// A value that knows how to decode arbirtary JSON value (and/or parse arbitrary JSON string) into value of type `a`.

// #### `Decoder.String:Decoder.Decoder<string>`

// Decoder that decodes JSON string to a `string` value.
// ```js
Decoder.decode(Decoder.String, true) //?_($)
Decoder.decode(Decoder.String, 42) //?_($)
Decoder.decode(Decoder.String, "Hello") //?_($)
Decoder.decode(Decoder.String, { hello: 42 }) //?_($)
// ```

// #### `Decoder.Boolean:Decoder.Decoder<boolean>`

// Decoder that decodes JSON boolean into a `boolean` value.
// ```js
Decoder.decode(Decoder.Boolean, true) //?_($)
Decoder.decode(Decoder.Boolean, 42) //?_($)
Decoder.decode(Decoder.Boolean, 3.14) //?_($)
Decoder.decode(Decoder.Boolean, "hello") //?_($)
Decoder.decode(Decoder.Boolean, { hello: 42 }) //?_($)
// ```

// #### `Decoder.Float:Decoder.Decoder<Decoder.float>`

// Decoder that decodes JSON number into a `Decoder.float` value, which is an [opaque type alias][] for `number` type. Given that `Infinity` and `NaN` are numbers (or not) in JS and footguns in practice it seemed more appropriate to provide a decoder that decodes to a number that is finite and is not a not a number :)

// ```js
Decoder.decode(Decoder.Float, 42) //?_($)
Decoder.decode(Decoder.Float, 3.14) //?_($)
Decoder.decode(Decoder.Float, NaN) //?_($)
Decoder.decode(Decoder.Float, Infinity) //?_($)
Decoder.decode(Decoder.Float, true) //?_($)
Decoder.decode(Decoder.Float, "hello") //?_($)
Decoder.decode(Decoder.Float, { hello: 42 }) //?_($)
// ```

// #### `Decoder.Integer:Decoder.Decoder<Decoder.integer>`

// Decoder that decodes JSON number into a `Decoder.integer` value, which is an [opaque type alias][] for `number` type guaranteed to be an integer (passing it to `Number.isInteger` returns `true`) and there for excludes (`+/-`)`Infinity` and `NaN`:

// ```js
Decoder.decode(Decoder.Integer, 42) //?_($)
Decoder.decode(Decoder.Integer, 3.14) //?_($)
Decoder.decode(Decoder.Integer, NaN) //?_($)
Decoder.decode(Decoder.Integer, Infinity) //?_($)
Decoder.decode(Decoder.Integer, true) //?_($)
Decoder.decode(Decoder.Integer, "hello") //?_($)
Decoder.decode(Decoder.Integer, { hello: 42 }) //?_($)
// ```

// ### Data structure decoders

// #### `Decoder.optional <a> (Decoder<a>):Decoder.Result<?a>)`

// Creates decoder that decodes optional (`null` / `undefined`) JSON values into an optional value.

// ```js
Decoder.decode(Decoder.optional(Decoder.Integer), 13) //?_($)
Decoder.decode(Decoder.optional(Decoder.Integer), null) //?_($)
Decoder.decode(Decoder.optional(Decoder.Integer), undefined) //?_($)
Decoder.decode(Decoder.optional(Decoder.Integer), false) //?_($)
Decoder.decode(Decoder.optional(Decoder.Integer), "hello") //?_($)
// ```

// #### `Decoder.array <a> (Decoder<a>):Decoder.Result<a[]>`

// Creates a decoder for JSON arrays, where each element is decoded via provided
// decoder:

// ```js
Decoder.decode(Decoder.array(Decoder.Boolean), [true, false]) //?_($)
Decoder.decode(Decoder.array(Decoder.Float), [1, 2.2, 3]) //?_($)
Decoder.decode(Decoder.array(Decoder.Integer), [1, 2.2, 3]) //?_($)
// ```

// #### `Decoder.dictionary <a> (Decoder<a>):Decoder.Result<{[string]:a}>`

// Creates a decoder for JSON (dictionary) objects, where each value is decoded via provided decoder. If you are trying to decode JSON objects that have values of different types (a.k.a structs) consider using `Decoder.record` instead.

// ```js
Decoder.decode(Decoder.dictionary(Decoder.Float), {
  alice: 42,
  bob: 99.8
}) //?_($)

Decoder.decode(Decoder.dictionary(Decoder.Integer), {
  alice: 42,
  bob: 99.8
}) //?_($)
// ```

// #### `Decoder.record <a:{}> (a):Decoder.Result<Decoder.Record<a>>`

// Creates a decoder for JSON (struct) objects, where each field is decoded via corresponding (same named) decoder in the passed structure:

// ```js
const point = Decoder.record({
  x: Decoder.Integer,
  y: Decoder.Integer
})

Decoder.decode(point, { x: 3, y: 5 }) //> Result.Ok {x:3, y:5}
Decoder.decode(point, { x: 3, y: 5, z: 7 }) //> Result.Ok {x:3, y:5}
Decoder.decode(point, { x: 3, y: 5.2 }) //> Result.Error Expecting an Integer at input["y"] but instead got: `5.2`
// ```

// ### Nested value decoders

// #### `Decoder.field <a> (string, Decoder.Decoder<a>):Decoder.Result<a>`

// Creates a decoder JSON object property decoder, where property matching a provided name is decoded via provided decoder:

// ```js
Decoder.decode(Decoder.field("x", Decoder.Integer), { x: 3 }) //?_($)
Decoder.decode(Decoder.field("x", Decoder.Integer), { x: 3, y: 4 }) //?_($)
Decoder.decode(Decoder.field("x", Decoder.Integer), { x: true }) //?_($)

Decoder.decode(Decoder.field("x", Decoder.Integer), { y: 4 }) //?_($)
Decoder.decode(Decoder.field("x", Decoder.Integer), "x=3") //?_($)
Decoder.decode(Decoder.field("name", Decoder.String), { name: "Tom" }) //?_($)
// ```

// Note that object can have other fields. Lots of them! The only thing this decoder cares about is if `x` is present and that the value there is an `Integer`.

// #### `Decoder.at <a> (string[], Decoder.Decoder<a>):Decoder.Result<a>`

// Creates a decode for a nested JSON object property:

// ```js
const profile = { person: { name: "Tom", age: 42 } }
Decoder.decode(Decoder.at(["person", "name"], Decoder.String), profile) //?_($)
Decoder.decode(Decoder.at(["person", "age"], Decoder.Integer), profile) //?_($)
// ```

// This is really just a shorthand for saying things like:

// ```js
Decoder.decode(
  Decoder.field("person", Decoder.field("age", Decoder.Integer)),
  profile
) //?_($)
// ```

// #### `Decoder.index <a> (number, Decoder.Decoder<a>):Decoder.Result<a>`

// Creates a decoder JSON array element decoder, where provided number is an index for the element which is decoded via provided decoder:

// ```js
const users = ["alice", "bob", "chuck"]
Decoder.decode(Decoder.index(0, Decoder.String), users) //?_($)
Decoder.decode(Decoder.index(1, Decoder.String), users) //?_($)
Decoder.decode(Decoder.index(2, Decoder.String), users) //?_($)
Decoder.decode(Decoder.index(3, Decoder.String), users) //?_($)
// ```

// ### Inconsistent structure decoders

// #### `Decoder.maybe <a> (Decoder.Decoder<a>):Decoder.Result<?a>`

// Creates decoder helpful for dealing with optional fields:

// ```js
const tom = { name: "tom", age: 42 }
Decoder.decode(Decoder.maybe(Decoder.field("age", Decoder.Integer)), tom) //?_($)
Decoder.decode(Decoder.maybe(Decoder.field("name", Decoder.Integer)), tom) //?_($)
Decoder.decode(Decoder.maybe(Decoder.field("height", Decoder.Float)), tom) //?_($)

Decoder.decode(Decoder.field("age", Decoder.maybe(Decoder.Integer)), tom) //?_($)
Decoder.decode(Decoder.field("name", Decoder.maybe(Decoder.Integer)), tom) //?_($)
Decoder.decode(Decoder.field("height", Decoder.maybe(Decoder.Integer)), tom) //?_($)
// ```
// Notice the last example! Error says that object with a field named `height` is expected but passed object does not has one so it errors.

// Point is, `maybe` will make exactly what it contains conditional. For optional fields, this means you probably want it outside a use of `field` or `at`.

// #### `Decoder.annul <a> (value:a):Decoder.Result<a>`

// Creates a decoder that decodes `null` as provided value. Decoding anything but
// `null` will error.

// ```js
Decoder.decode(Decoder.annul(false), null) //?_($)
Decoder.decode(Decoder.annul(42), null) //?_($)
Decoder.decode(Decoder.annul(42), 42) //?_($)
Decoder.decode(Decoder.annul(42), false) //?_($)
// ```

// #### `Decoder.either <a> (Decoder.Decoder<a>[]):Decoder<a>`

// Creates a decoder that tries provided decoders until one succeeds or all of them error. It is useful if the JSON may come in a couple of different formats. For example, say you want to read an array of strings, but some of the elements can be `null`s.

// ```js
const badName = Decoder.either(Decoder.String, Decoder.annul(""))
Decoder.decode(Decoder.array(badName), ["alice", "bob", null, "chuck"]) //?_($)
// ```
// Why would someone generate JSON like this? Questions like this are not good for your health. The point is that you can use `either` to handle situations like this!

// You could also use `either` to help version your data. Try the latest format, then a few older ones that you still support.

// #### `Decoder.ok <a> (value:a):Decoder.Decoder<a>`

// Creates a decoder that decodes to provided `value` regardless of what is it decoding.

// ```js
Decoder.decode(Decoder.ok(42), true) //?_($)
Decoder.decode(Decoder.ok(42), [1, 2, 3]) //?_($)
Decoder.decode(Decoder.ok(42), "hello") //?_($)
//```
// It is mostly useful in combination with `either`:

// ```js
const name = Decoder.either(
  Decoder.field("username", Decoder.String),
  Decoder.field("email", Decoder.String),
  Decoder.ok("stranger")
)

Decoder.decode(name, { username: "Jack" }) //?_($)
Decoder.decode(name, { email: "jack@email.com" }) //?_($)
Decoder.decode(name, {}) //?_($)
// ```

// #### `Decoder.error <a> (string):Decoder.Decoder<a>`

// Creates a decoder that errors with provided message regardless of what is it decoding.
// ```js
Decoder.decode(Decoder.error("Boom!"), true) //?_($)
Decoder.decode(Decoder.error("Boom!"), [1, 2, 3]) //?_($)
Decoder.decode(Decoder.error("Boom!"), "hello") //?_($)
// ```

// It is useful in combination with `either` to provide more contectual error messages:

// ```js
const phone = Decoder.either(
  Decoder.field("cell", Decoder.String),
  Decoder.field("home", Decoder.String),
  Decoder.error("No phone number")
)

Decoder.decode(phone, { cell: "415-5588-0000", home: "415-8855-0000" }) //?_($)
Decoder.decode(phone, { home: "415-8855-0000" }) //?_($)
Decoder.decode(phone, {}) //?_($)
// ```

// ### Run Decoders

// #### `Decoder.decode <a> (Decoder.Decoder<a>, json:mixed):Decoder.Result<a>`

// Runs given `Decoder<a>` on a given JSON value. Returns `Result` that either
// contains `Decoder.Error` if value can't be decoded with a given decoder or
// a `Result.Ok<a>`.

// #### `Decoder.parse <a> (Decoder.Decoder<a>, input:string):Decoder.Result<a>`

// Parses given `input` string into a JSON value and then runs given `Decoder<a>`
// on it. Returns `Result` with `Result.Error<Decoder.ParseError>` if the string
// is not well-formed JSON or `Result.Error<Decoder.Error>` if the value can't be
// decoded with a given `Decoder<a>`. If operation is successfull returns
// `Result.Ok<a>`.

// ```js
Decoder.parse(Decoder.Boolean, "true") //?_($)
Decoder.parse(Decoder.Boolean, "42") //?_($)
Decoder.parse(Decoder.Boolean, "{") //?_($)
Decoder.parse(Decoder.field("a", Decoder.Integer), '{ "a": 42 }') //?_($)
// ```
// ### Non-JSON decoders

// Library can also be used to extract typed data from arbitrary JS objects and all
// of the decoders covered will work. There some additional decoders that are
// specific to data extraction from non-JSON values.

// #### `Decoder.accessor <a> (string, Decoder.Decoder<a>):Decoder.Decoder<a>`

// Creates a decoder that decodes return value of the method that has name as
// passed string and on an object being decoded:

// ```js
Decoder.decode(Decoder.accessor("cwd", Decoder.String), process) //?_($)
Decoder.decode(Decoder.accessor("pwd", Decoder.String), process) //?_($)
// ```

// #### `Decoder.form <a:{}> (a):Decoder.Decoder<Decoder.Record<a>>`

// Creates a decoder for objects, where each field is decoded with a corresponding decoder over the passed object. Note that unlike `Decoder.record` each field is decoded from the `object` itself rather than same named field, there for fields of the result can be formed arbitrarily:

// ```js
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
// ```

// [opaque type alias]:https://flow.org/en/docs/types/opaque-types/
