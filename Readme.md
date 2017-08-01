# decoder.flow
[![travis][travis.icon]][travis.url]
[![package][version.icon] ![downloads][downloads.icon]][package.url]
[![styled with prettier][prettier.icon]][prettier.url]

**Library was implemented after Elm [JSON.Decode][], it mostly keeps same API
although some parts are modifed to fit better JS and Flow semantics.**

Library for turning arbitrary input into typed data. You can use this library to convert arbitrary JSON into nicely structured (and flow typed) data.

The core concept in this library is a decoder. It decodes JSON values into typed values. Library provides some primitive decoders for handling primitive data types and some functions to put those together to form decoders that can handle more complex data.

Library can also be used to put together structure data parsers that take strings of input and return typed data. See `parse` function for more details.

### Import

Rest of the the document & provided code examples assumes that library is installed & imported as follows:

```js
import * as Decoder from "./"
```

### Primitive value decoders


#### `Decoder.Decoder<a>`

A value that knows how to decode arbirtary JSON value (and/or parse arbitrary JSON string) into value of type `a`.

#### `Decoder.String:Decoder.Decoder<string>`

Decoder that decodes JSON string to a `string` value.

```js
Decoder.decode(Decoder.String, true) //>  Result.Error Expecting a String but instead got: `true`
Decoder.decode(Decoder.String, 42) //>  Result.Error Expecting a String but instead got: `42`
Decoder.decode(Decoder.String, "Hello") //> Result.Ok "Hello"
Decoder.decode(Decoder.String, {hello:42}) //>  Result.Error Expecting a String but instead got: {hello:42}`
```


#### `Decoder.Boolean:Decoder.Decoder<boolean>`

Decoder that decodes JSON boolean into a `boolean` value.

```js
Decoder.decode(Decoder.Boolean, true) //> Result.Ok true
Decoder.decode(Decoder.Boolean, 42) //>  Result.Error Expecting a Boolean but instead got: `42`
Decoder.decode(Decoder.Boolean, 3.14) //>  Result.Error Expecting a Boolean but instead got: `3.14`
Decoder.decode(Decoder.Boolean, "Hello") //>  Result.Error Expecting a Boolean but instead got: `"Hello"`
Decoder.decode(Decoder.Boolean, {hello:42}) //>  Result.Error Expecting a Boolean but instead got: `{hello:42}`
```

#### `Decoder.Float:Decoder.Decoder<Decoder.float>`

Decoder that decodes JSON number into a `Decoder.float` value, which is an [opaque type alias][] for `number` type. Given that `Infinity` and `NaN` are numbers (or not) in JS and footguns in practice it seemed more appropriate to provide a decoder that decodes to a number that is finite and is not a not a number :)

```js
Decoder.decode(Decoder.Float, 42) //> Result.Ok 42
Decoder.decode(Decoder.Float, 3.14) // Result.Ok 3.14
Decoder.decode(Decoder.Float, NaN) //>  Result.Error Expecting a Float but instead got: `NaN`
Decoder.decode(Decoder.Float, Infinity) //>  Result.Error Expecting a Float but instead got: `Infinity`
Decoder.decode(Decoder.Float, true) //>  Result.Error Expecting a Float but instead got: `true`
Decoder.decode(Decoder.Float, "hello") // Result.Error Expecting a Float but instead got: `"hello"`
Decoder.decode(Decoder.Float, {hello:42}) //> Result.Error Expecting a Float but instead got: `{hello:42}`
```

#### `Decoder.Integer:Decoder.Decoder<Decoder.integer>`

Decoder that decodes JSON number into a `Decoder.integer` value, which is an [opaque type alias][] for `number` type guaranteed to be an integer (passing it to `Number.isInteger` returns `true`) and there for excludes (`+/-`)`Infinity` and `NaN`:

```js
Decoder.decode(Decoder.Integer, 42) //> Ok 42
Decoder.decode(Decoder.Integer, 3.14) //  Result.Error Expecting an Integer but instead got: `3.14`
Decoder.decode(Decoder.Integer, NaN) //>  Result.Error Expecting an Integer but instead got: `NaN`
Decoder.decode(Decoder.Integer, Infinity) //>  Result.Error Expecting an Integer but instead got: `Infinity`
Decoder.decode(Decoder.Integer, true) //>  Result.Error Expecting an Integer but instead got: `true`
Decoder.decode(Decoder.Integer, "hello") //>  Result.Error Expecting an Integer but instead got: `"hello"`
Decoder.decode(Decoder.Integer, {hello:42}) //>  Result.Error Expecting an Integer but instead got: `{hello:42}`
```

### Data structure decoders

#### `Decoder.optional <a> (Decoder<a>):Decoder.Decoder<?a>)`


Creates decoder that decodes optional (`null` / `undefined`) JSON values into an optional value.

```js
Decoder.decode(Decoder.optional(Decoder.Integer), 13) //> Result.Ok 13
Decoder.decode(Decoder.optional(Decoder.Integer), null) //> Result.Ok null
Decoder.decode(Decoder.optional(Decoder.Integer), undefined) //> Result.Ok null
Decoder.decode(Decoder.optional(Decoder.Integer), false) //> Result.Error Expecting an Integer but instead got: `false`
Decoder.decode(Decoder.optional(Decoder.Integer), "hello") //> Result.Error Expecting an Integer but instead got: `"hello"`
```

#### `Decoder.array <a> (Decoder<a>):Decoder.Decoder<a[]>`

Creates a decoder for JSON arrays, where each element is decoded via provided
decoder:

```js
Decoder.decode(Decoder.array(Decoder.Boolean), [true, false]) //> Result.Ok [true, false]
Decoder.decode(Decoder.array(Decoder.Float), [1, 2.2, 3]) //> Result.Ok [1, 2.2, 3]
Decoder.decode(Decoder.array(Decoder.Integer), [1, 2.2, 3]) //>  Result.Error Expecting an Integer at input[1] but instead got: `2.2`
```

#### `Decoder.dictionary <a> (Decoder<a>):Decoder.Docoder<{[string]:a}>`

Creates a decoder for JSON (dictionary) objects, where each value is decoded via provided decoder. If you are trying to decode JSON objects that have values of different types (a.k.a structs) consider using `Decoder.record` instead.

```js
Decoder.decode(Decoder.dictionary(Decoder.Float), {
  alice: 42,
  bob: 99.8
}) //> Result.Ok {"alice":42,"bob":99.8}


Decoder.decode(Decoder.dictionary(Decoder.Integer), {
  alice: 42,
  bob: 99.8
}) //> Result.Error Expecting an Integer at input["bob"] but instead got: `99.8`
```

#### `Decoder.record <a:{}> (a):Decoder.Decoder<Decoder.Record<a>>`

Creates a decoder for JSON (struct) objects, where each field is decoded with corresponding decoder over corresponding field in JSON (struct):

```js
const point = Decoder.record({
  x: Decoder.Integer,
  y: Decoder.Integer
})

Decoder.decode(point, { x: 3, y: 5 }) //> Result.Ok {x:3, y:5}
Decoder.decode(point, { x: 3, y: 5, z: 7 }) //> Result.Ok {x:3, y:5}
Decoder.decode(point, { x: 3, y: 5.2 }) //> Result.Error Expecting an Integer at input["y"] but instead got: `5.2`
```

### Nested value decoders

#### `Decoder.field <a> (string, Decoder.Decoder<a>):Decoder.Decoder<a>`

Creates a decoder JSON object property decoder, where property matching a provided name is decoded via provided decoder:

```js
Decoder.decode(Decoder.field("x", Decoder.Integer), { x: 3 }) //> Result.Ok 3
Decoder.decode(Decoder.field("x", Decoder.Integer), { x: 3, y: 4 }) //> Result.Ok 3
Decoder.decode(Decoder.field("x", Decoder.Integer), { x: true }) //>  Result.Error Expecting an Integer at input["x"] but instead got: `true`
Decoder.decode(Decoder.field("x", Decoder.Integer), { y: 4 }) //>   Result.Error Expecting an object with a field named 'x' but instead got: `{"y":4}`
Decoder.decode(Decoder.field("x", Decoder.Integer), "x=3") //> Result.Error Expecting an object with a field named 'x' but instead got: `"x=3"`
Decoder.decode(Decoder.field("name", Decoder.String), { name: "Tom" }) //> Result.Ok "Tom"
```

Note that object can have other fields. Lots of them! The only thing this decoder cares about is if `x` is present and that the value there is an `Integer`.

#### `Decoder.at <a> (string[], Decoder.Decoder<a>):Decoder.Decoder<a>`

Creates a decode for a nested JSON object property:

```js
const profile = { person: { name: "Tom", age: 42 } }
Decoder.decode(Decoder.at(["person", "name"], Decoder.String), profile) //> Result.Ok "Tom"
Decoder.decode(Decoder.at(["person", "age"], Decoder.Integer), profile) //> Result.Ok 42
```

This is really just a shorthand for saying things like:

```js
Decoder.decode(
  Decoder.field("person", Decoder.field("age", Decoder.Integer)),
  profile
) //> Result.Ok 42
```

#### `Decoder.index <a> (number, Decoder.Decoder<a>):Decoder.Decoder<a>`

Creates a decoder JSON array element decoder, where provided number is an index for the element which is decoded via provided decoder:

```js
const users = ["alice", "bob", "chuck"]
Decoder.decode(Decoder.index(0, Decoder.String), users) //> Result.Ok "alice"
Decoder.decode(Decoder.index(1, Decoder.String), users) //> Result.Ok "bob"
Decoder.decode(Decoder.index(2, Decoder.String), users) //> Result.Ok "chuck"
Decoder.decode(Decoder.index(3, Decoder.String), users) //>  Result.Error Expecting a longer (>=4) array but instead got: `["alice","bob","chuck"]`
```

### Inconsistent structure decoders


#### `Decoder.maybe <a> (Decoder.Decoder<a>):Decoder.Decoder<?a>`

Creates decoder helpful for dealing with optional fields:

```js
const tom = { name: "tom", age: 42 }
Decoder.decode(Decoder.maybe(Decoder.field("age", Decoder.Integer)), tom) //> Result.Ok 42
Decoder.decode(Decoder.maybe(Decoder.field("name", Decoder.Integer)), tom) //> Result.Ok null
Decoder.decode(Decoder.maybe(Decoder.field("height", Decoder.Float)), tom) //> Result.Ok null

Decoder.decode(Decoder.field("age", Decoder.maybe(Decoder.Integer)), tom) //> Result.Ok 42
Decoder.decode(Decoder.field("name", Decoder.maybe(Decoder.Integer)), tom) //> Result.Ok null
Decoder.decode(Decoder.field("height", Decoder.maybe(Decoder.Integer)), tom) //> Result.Error Expecting an object with a field named 'height' but instead got: `{"name":"tom","age":42}`
```
Notice the last example! Error says that object with a field named `height` is expected but passed object does not has one so it errors.

Point is, `maybe` will make exactly what it contains conditional. For optional fields, this means you probably want it outside a use of `field` or `at`.

#### `Decoder.annul <a> (a):Decoder.Decoder<a>`

Creates a decoder that decodes `null` as provided value. Decoding anything but
`null` will error.

```js
Decoder.decode(Decoder.annul(false), null) //> Result.Ok false
Decoder.decode(Decoder.annul(42), null) //> Result.Ok 42
Decoder.decode(Decoder.annul(42), 42) //> Result.Error Expecting a null but instead got: `42`
Decoder.decode(Decoder.annul(42), false) //> Result.Error Expecting a null but instead got: `false`
```

#### `Decoder.either <a> (Decoder.Decoder<a>[]):Decoder<a>`

Creates a decoder that tries provided decoders until one succeeds or all of them error. It is useful if the JSON may come in a couple of different formats. For example, say you want to read an array of strings, but some of the elements can be `null`s.

```js
const badName = Decoder.either(Decoder.String, Decoder.annul(""))
Decoder.decode(Decoder.array(badName), ["alice", "bob", null, "chuck"]) //> ["alice", "bob", "", "chuck"]
```
Why would someone generate JSON like this? Questions like this are not good for your health. The point is that you can use `either` to handle situations like this!

You could also use `either` to help version your data. Try the latest format, then a few older ones that you still support.

#### `Decoder.ok <a> (a):Decoder.Decoder<a>`

Creates a decoder that decodes to provided `value` regardless of what is it decoding.

```js
Decoder.decode(Decoder.ok(42), true) //> Result.Ok 42
Decoder.decode(Decoder.ok(42), [1, 2, 3]) //> Result.Ok 42
Decoder.decode(Decoder.ok(42), "hello") //> Result.Ok 42
```

It is mostly useful in combination with `either`:

```js
const name = Decoder.either(Decoder.field('username', Decoder.String),
                            Decoder.field('email', Decoder.String),
                            Decoder.ok('stranger'))
Decoder.decode(name, {username:"Jack"}) //> Result.Ok "Jack"
Decoder.decode(name, {email:"jack@email.com"}) //> Result.Ok "jack@email.com"
Decoder.decode(name, {}) //> Result.Ok "stranger"
```

#### `Decoder.error <a> (string):Decoder.Decoder<a>`

Creates a decoder that errors with provided message regardless of what is it decoding.

```js
Decoder.decode(Decoder.error("Boom!"), true) //> Result.Error Boom!
Decoder.decode(Decoder.error("Boom!"), [1, 2, 3]) //> Result.Error Boom!
Decoder.decode(Decoder.error("Boom!"), "hello") //> Result.Error Boom!
```

It is useful in combination with `either` to provide more contectual error messages:

```js
const phone = Decoder.either(
  Decoder.field('cell', Decoder.String),
  Decoder.field('home', Decoder.String),
  Decoder.error('No phone number'))

Decoder.decode(phone, {cell:"415-5588-0000", home:"415-8855-0000"}) //> Result.Ok "415-5588-0000"
Decoder.decode(phone, {home:"415-8855-0000"}) //> Result.Ok "415-8855-0000"
Decoder.decode(phone, {}) //> Result.Error No phone number
```


### Run Decoders

#### `Decoder.decode <a> (Decoder.Decoder<a>, json:mixed):Decoder.Result<a>`

Runs given `Decoder<a>` on a given JSON value. Returns `Result` that either
contains `Decoder.Error` if value can't be decoded with a given decoder or
a `Result.Ok<a>`.

#### `Decoder.parse <a> (Decoder.Decoder<a>, input:string):Decoder.Result<a>`

Parses given `input` string into a JSON value and then runs given `Decoder<a>`
on it. Returns `Result` with `Result.Error<Decoder.ParseError>` if the string
is not well-formed JSON or `Result.Error<Decoder.Error>` if the value can't be
decoded with a given `Decoder<a>`. If operation is successfull returns
`Result.Ok<a>`.

```js
Decoder.parse(Decoder.Boolean, "true") //> Result.Ok true
Decoder.parse(Decoder.Boolean, "42") //> Result.Error Expecting a Boolean but instead got: `42`
Decoder.parse(Decoder.Boolean, "{") //>  Result.Error Parse error: Unexpected end of JSON input
Decoder.parse(Decoder.field("a", Decoder.Integer), '{ "a": 42 }') //> Result.Ok 42
```

### Non-JSON decoders

Library can also be used to extract typed data from arbitrary JS objects and all
of the decoders covered will work. There some additional decoders that are
specific to data extraction from non-JSON values.


#### `Decoder.accessor <a> (string, Decoder.Decoder<a>):Decoder.Decoder<a>`

Creates a decoder that decodes return value of the method that has name as
passed string and on an object being decoded:

```js
Decoder.decode(Decoder.accessor("cwd", Decoder.String), process) //> Result.Ok "/Users/gozala/Projects/decoder.flow"
Decoder.decode(Decoder.accessor("pwd", Decoder.String), process) //> Result.Error Expecting an object with a method named 'pwd' but instead got: `{/*...*/}`
```

#### `Decoder.form <a:{}> (a):Decoder.Decoder<Decoder.Record<a>>`

Creates a decoder for objects, where each field is decoded with a corresponding decoder over the passed object. Note that unlike `Decoder.record` each field is decoded from the `object` itself rather than same named field, there for fields of the result can be formed arbitrarily:

```js
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
) //> Result.Ok  Result.Ok {"title":"/usr/local/bin/node","cwd":"/Users/gozala/Projects/decoder.flow","architecture":"x64","heapUsed":52124520}
```

## Install

    npm install decoder.flow

## Prior Art

- [Elm Json.Decode][Json.Decode]


[opaque type alias]:https://flow.org/en/docs/types/opaque-types/
[Json.Decode]:http://package.elm-lang.org/packages/elm-lang/core/5.1.1/Json-Decode

[travis.icon]: https://travis-ci.org/Gozala/decoder.flow.svg?branch=master
[travis.url]: https://travis-ci.org/Gozala/decoder.flow

[version.icon]: https://img.shields.io/npm/v/decoder.flow.svg
[downloads.icon]: https://img.shields.io/npm/dm/decoder.flow.svg
[package.url]: https://npmjs.org/package/decoder.flow


[downloads.image]: https://img.shields.io/npm/dm/decoder.flow.svg
[downloads.url]: https://npmjs.org/package/decoder.flow

[prettier.icon]:https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier.url]:https://github.com/prettier/prettier