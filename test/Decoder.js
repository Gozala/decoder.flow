/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"

test("test baisc", async test => {
  test.deepEqual(typeof Decoder, "object")
  test.deepEqual(typeof Decoder.String, "object")
  test.deepEqual(typeof Decoder.Boolean, "object")
  test.deepEqual(typeof Decoder.Integer, "object")
  test.deepEqual(typeof Decoder.Float, "object")

  test.deepEqual(typeof Decoder.fail, "function")
  test.deepEqual(typeof Decoder.array, "function")
  test.deepEqual(typeof Decoder.dictionary, "function")
  test.deepEqual(typeof Decoder.entries, "function")
  test.deepEqual(typeof Decoder.field, "function")
  test.deepEqual(typeof Decoder.index, "function")
  test.deepEqual(typeof Decoder.accessor, "function")
  test.deepEqual(typeof Decoder.at, "function")
  test.deepEqual(typeof Decoder.maybe, "function")
  test.deepEqual(typeof Decoder.optional, "function")
  test.deepEqual(typeof Decoder.either, "function")
  test.deepEqual(typeof Decoder.record, "function")
})

test("Decoder.String", async test => {
  test.deepEqual(Decoder.String, { type: "String" })

  assert(
    {
      "Decoder.String": Decoder.String,
      '{type:"String"}': { type: "String" }
    },
    input,
    {
      '""': Result.ok(""),
      'new String("")': Result.ok(""),
      '"hello"': Result.ok("hello"),
      'new String("Hello")': Result.ok("Hello")
    },
    (decoder, input, expect, key, name) =>
      test.deepEqual(
        format(Decoder.decode(input, decoder)),
        expect ||
          Result.error(`Expecting a String but instead got: \`${key}\``),
        `Decoder.decode(${key}, ${name})`
      )
  )
})

test("Decoder.Boolean", async test => {
  test.deepEqual(Decoder.Boolean, { type: "Boolean" })

  assert(
    {
      "Decoder.Boolean": Decoder.Boolean,
      '{type:"Boolean"}': { type: "Boolean" }
    },
    input,
    {
      true: Result.ok(true),
      false: Result.ok(false)
    },
    (decoder, input, expect, key, name) =>
      test.deepEqual(
        format(Decoder.decode(input, decoder)),
        expect ||
          Result.error(`Expecting a Boolean but instead got: \`${key}\``),
        `Decoder.decode(${key}, ${name})`
      )
  )
})

test("Decoder.Integer", async test => {
  test.deepEqual(Decoder.Integer, { type: "Integer" })

  assert(
    {
      "Decoder.Integer": Decoder.Integer,
      '{type: "Integer"}': { type: "Integer" }
    },
    input,
    {
      "0": Result.ok(0),
      "-15": Result.ok(-15),
      "15": Result.ok(15)
    },
    (decoder, input, expect, key, name) =>
      test.deepEqual(
        format(Decoder.decode(input, decoder)),
        expect ||
          Result.error(`Expecting an Integer but instead got: \`${key}\``),
        `Decoder.decode(${key}, ${name})`
      )
  )
})

test("Decoder.Float", async test => {
  test.deepEqual(Decoder.Float, { type: "Float" })

  assert(
    {
      "Decoder.Float": Decoder.Float,
      '{type: "Float"}': { type: "Float" }
    },
    input,
    {
      "0": Result.ok(0),
      "-15": Result.ok(-15),
      "15": Result.ok(15),
      "0.2": Result.ok(0.2),
      "-9.8": Result.ok(-9.8)
    },
    (decoder, input, expect, key, name) =>
      test.deepEqual(
        format(Decoder.decode(input, decoder)),
        expect || Result.error(`Expecting a Float but instead got: \`${key}\``),
        `Decoder.decode(${key}, ${name})`
      )
  )
})

test("Decoder.fail", async test => {
  test.deepEqual(Decoder.fail("Boom!"), { type: "Fail", fail: "Boom!" })

  assert(
    {
      'Decoder.fail("Boom!")': Decoder.fail("Boom!"),
      '{type:"Fail",fail:"Boom!"}': { type: "Fail", fail: "Boom!" }
    },
    input,
    {},
    (decoder, input, expect, key, name) =>
      test.deepEqual(
        format(Decoder.decode(input, decoder)),
        expect || Result.error(`Boom!`),
        `Decoder.decode(${key}, ${name})`
      )
  )
})

test("Decoder.field", async test => {
  test.deepEqual(Decoder.field("a", Decoder.Integer), {
    type: "Field",
    name: "a",
    field: Decoder.Integer
  })

  assert(
    {
      'Decoder.field("a", Decoder.Integer)': Decoder.field(
        "a",
        Decoder.Integer
      ),
      '{type:"Field",name:"a",field:{type:"Integer"}}': ({
        type: "Field",
        name: "a",
        field: { type: "Integer" }
      }: any)
    },
    input,
    {
      '{"a":2}': Result.ok(2),
      '{"a":"A","b":{"c":{"d":4}}}': Result.error(
        'Expecting an Integer at input["a"] but instead got: `"A"`'
      )
    },
    (decoder, input, expect, key, name) =>
      test.deepEqual(
        format(Decoder.decode(input, decoder)),
        expect ||
          Result.error(
            `Expecting an object with a field named \'a\' but instead got: \`${key}\``
          ),
        `Decoder.decode(${key}, ${name})`
      )
  )

  test.deepEqual(Decoder.field("b", Decoder.field("c", Decoder.Float)), {
    type: "Field",
    name: "b",
    field: {
      type: "Field",
      name: "c",
      field: Decoder.Float
    }
  })

  assert(
    {
      'Decoder.field("b", Decoder.field("c", Decoder.Float))': Decoder.field(
        "b",
        Decoder.field("c", Decoder.Float)
      ),
      '{type:"Field",name:"b",field:{type: "Field",name:"c",field:{type:"Float"}}}': ({
        type: "Field",
        name: "b",
        field: {
          type: "Field",
          name: "c",
          field: { type: "Float" }
        }
      }: any)
    },
    input,
    {
      '{"b":{"c":4.3}}': Result.ok(4.3),
      '{"a":"A","b":{"c":{"d":4}}}': Result.error(
        'Expecting a Float at input["b"]["c"] but instead got: `{"d":4}`'
      )
    },
    (decoder, input, expect, key, name) =>
      test.deepEqual(
        format(Decoder.decode(input, decoder)),
        expect ||
          Result.error(
            `Expecting an object with a field named \'b\' but instead got: \`${key}\``
          ),
        `Decoder.decode(${key}, ${name})`
      )
  )
})

test("Decoder.index", async test => {
  test.deepEqual(Decoder.index(0, Decoder.Integer), {
    type: "Index",
    index: 0,
    member: Decoder.Integer
  })

  assert(
    {
      "Decoder.index(0, Decoder.Integer)": Decoder.index(0, Decoder.Integer),
      '{type:"Index",index:0,member:{type:"Integer"}}': ({
        type: "Index",
        index: 0,
        member: { type: "Integer" }
      }: any)
    },
    input,
    {
      "[7]": Result.ok(7),
      "[1.1,2,3,4]": Result.error(
        "Expecting an Integer at input[0] but instead got: `1.1`"
      ),
      "[]": Result.error(
        "Expecting a longer (>=1) array but instead got: `[]`"
      ),
      '["foo"]': Result.error(
        `Expecting an Integer at input[0] but instead got: \`"foo"\``
      ),
      "[true]": Result.error(
        `Expecting an Integer at input[0] but instead got: \`true\``
      ),
      "[false]": Result.error(
        `Expecting an Integer at input[0] but instead got: \`false\``
      ),
      '[["a","b","c","d"]]': Result.error(
        'Expecting an Integer at input[0] but instead got: `["a","b","c","d"]`'
      )
    },
    (decoder, input, expect, key, name) =>
      test.deepEqual(
        format(Decoder.decode(input, decoder)),
        expect ||
          Result.error(`Expecting an array but instead got: \`${key}\``),
        `Decoder.decode(${key}, ${name})`
      )
  )

  assert(
    {
      "Decoder.index(3, Decoder.Float)": Decoder.index(3, Decoder.Float),
      '{type:"Index",index:3,member:{type:"Float"}}': ({
        type: "Index",
        index: 3,
        member: { type: "Float" }
      }: any)
    },
    input,
    {
      "[7]": Result.error(
        "Expecting a longer (>=4) array but instead got: `[7]`"
      ),
      "[1.1,2,3,4]": Result.ok(4),
      "[]": Result.error(
        "Expecting a longer (>=4) array but instead got: `[]`"
      ),
      '["foo"]': Result.error(
        'Expecting a longer (>=4) array but instead got: `["foo"]`'
      ),
      "[true]": Result.error(
        "Expecting a longer (>=4) array but instead got: `[true]`"
      ),
      "[false]": Result.error(
        "Expecting a longer (>=4) array but instead got: `[false]`"
      ),
      '[["a","b","c","d"]]': Result.error(
        'Expecting a longer (>=4) array but instead got: `[["a","b","c","d"]]`'
      )
    },
    (decoder, input, expect, key, name) =>
      test.deepEqual(
        format(Decoder.decode(input, decoder)),
        expect ||
          Result.error(`Expecting an array but instead got: \`${key}\``),
        `Decoder.decode(${key}, ${name})`
      )
  )

  test.deepEqual(Decoder.index(0, Decoder.index(2, Decoder.String)), {
    type: "Index",
    index: 0,
    member: {
      type: "Index",
      index: 2,
      member: Decoder.String
    }
  })

  assert(
    {
      "Decoder.index(0, Decoder.index(3, Decoder.String))": Decoder.index(
        0,
        Decoder.index(3, Decoder.String)
      ),
      '{type:"Index",index:0,member:{type:"Index",index:3,member:{type:"String"}}}': ({
        type: "Index",
        index: 0,
        member: { type: "Index", index: 3, member: { type: "String" } }
      }: any)
    },
    input,
    {
      "[]": Result.error(
        "Expecting a longer (>=1) array but instead got: `[]`"
      ),
      "[7]": Result.error(
        "Expecting an array at input[0] but instead got: `7`"
      ),
      "[1.1,2,3,4]": Result.error(
        "Expecting an array at input[0] but instead got: `1.1`"
      ),
      '["foo"]': Result.error(
        'Expecting an array at input[0] but instead got: `"foo"`'
      ),
      "[true]": Result.error(
        "Expecting an array at input[0] but instead got: `true`"
      ),
      "[false]": Result.error(
        "Expecting an array at input[0] but instead got: `false`"
      ),
      '[["a","b","c","d"]]': Result.ok("d")
    },
    (decoder, input, expect, key, name) =>
      test.deepEqual(
        format(Decoder.decode(input, decoder)),
        expect ||
          Result.error(`Expecting an array but instead got: \`${key}\``),
        `Decoder.decode(${key}, ${name})`
      )
  )
})

test("Decoder.optional", async test => {
  const options: Array<{
    decoder: Decoder.Decoder<any>,
    fallback: mixed,
    name: string,
    fail: string => string,
    expect: { [string]: mixed }
  }> = [
    {
      decoder: Decoder.Float,
      fallback: 4,
      name: "Float",
      fail: (actual: string) =>
        `Expecting a Float but instead got: \`${actual}\``,
      expect: {
        "0": Result.ok(0),
        "-15": Result.ok(-15),
        "15": Result.ok(15),
        "0.2": Result.ok(0.2),
        "-9.8": Result.ok(-9.8),
        null: Result.ok(4),
        undefined: Result.ok(4)
      }
    },
    {
      decoder: Decoder.Integer,
      fallback: 7,
      name: "Integer",
      fail: (actual: string) =>
        `Expecting an Integer but instead got: \`${actual}\``,
      expect: {
        "0": Result.ok(0),
        "-15": Result.ok(-15),
        "15": Result.ok(15),
        null: Result.ok(7),
        undefined: Result.ok(7)
      }
    },
    {
      decoder: Decoder.String,
      fallback: "<nothing>",
      name: "String",
      fail: (actual: string) =>
        `Expecting a String but instead got: \`${actual}\``,
      expect: {
        '""': Result.ok(""),
        'new String("")': Result.ok(""),
        '"hello"': Result.ok("hello"),
        'new String("Hello")': Result.ok("Hello"),
        null: Result.ok("<nothing>"),
        undefined: Result.ok("<nothing>")
      }
    }
  ]

  for (let { decoder, fallback, name, expect, fail } of options) {
    const show = `Decoder.optional(Decoder.${name}, ${JSON.stringify(
      fallback
    )})`

    test.deepEqual(
      Decoder.optional(decoder, fallback),
      {
        type: "Either",
        either: [
          decoder,
          {
            type: "Null",
            Null: fallback
          },
          {
            type: "Undefined",
            Undefined: fallback
          }
        ]
      },
      `${show} : { type: Decoder.Type.Either, decoders: [...] }`
    )

    assert(
      { decoder: Decoder.optional(decoder, fallback) },
      input,
      expect,
      (decoder, input, expect, key, _) =>
        test.deepEqual(
          format(Decoder.decode(input, decoder)),
          expect ||
            Result.error(`I ran into the following problems:

${fail(key)}
Expecting null but instead got: \`${key}\`
Expecting undefined but instead got: \`${key}\``),
          `Decoder.decode(${key}, ${show})`
        )
    )
  }
})

test("Decoder.maybe", async test => {
  test.deepEqual(
    Decoder.maybe(Decoder.Integer),
    {
      type: "Maybe",
      maybe: Decoder.Integer
    },
    `Decoder.maybe(Decoder.Integer) : {type:Decoder.Type.Maybe, decoder:Decoder.Integer}`
  )

  assert(
    {
      "Decoder.maybe(Decoder.Integer)": Decoder.maybe(Decoder.Integer),
      '{type: "Maybe",maybe:{type:"Integer"}}': ({
        type: "Maybe",
        maybe: { type: "Integer" }
      }: any)
    },
    input,
    {
      "0": Result.ok(0),
      "-15": Result.ok(-15),
      "15": Result.ok(15)
    },
    (decoder, input, expect, key, name) => {
      const result = Decoder.decode(input, decoder)
      test.deepEqual(
        result.format(error => error.describe()),
        expect || Result.ok(null),
        `Decoder.decode(${key}, ${name})`
      )
    }
  )
})

const assert = <a>(
  decoders: { [string]: a },
  input: { [string]: mixed },
  expect: { [string]: mixed },
  assert: (a, mixed, mixed, string, string) => void
): void => {
  for (let name of Object.keys(decoders)) {
    const decoder = decoders[name]
    for (let key of Object.keys(input)) {
      assert(decoder, input[key], expect[key], key, name)
    }
  }
}

const format = <a>(result: Decoder.Result<a>): Result.Result<string, a> =>
  result.format(error => error.describe())

const input = {
  null: null,
  undefined: undefined,
  true: true,
  false: false,
  "new Boolean(true)": new Boolean(true),
  "new Boolean(false)": new Boolean(false),
  "0": 0,
  "new Number(0)": new Number(0),
  "-15": -15,
  "new Number(-15)": new Number(-15),
  "15": 15,
  "new Number(15)": new Number(15),
  "0.2": 0.2,
  "new Number(0.2)": new Number(0.2),
  "-9.8": -9.8,
  "new Number(-9.8)": new Number(-9.8),
  Infinity: Infinity,
  "-Infinity": -Infinity,
  NaN: NaN,
  "[]": [],
  "[7]": [7],
  '["foo"]': ["foo"],
  "[true]": [true],
  "[false]": [false],
  "[1.1,2,3,4]": [1.1, 2, 3, 4],
  '[["a","b","c","d"]]': [["a", "b", "c", "d"]],
  '""': "",
  'new String("")': new String(""),
  '"hello"': "hello",
  'new String("Hello")': new String("Hello"),
  "Symbol(foo)": Symbol("foo"),
  '{"a":2}': { a: 2 },
  '{"b":{"c":4.3}}': { b: { c: 4.3 } },
  '{"a":"A","b":{"c":{"d":4}}}': { a: "A", b: { c: { d: 4 } } }
}
