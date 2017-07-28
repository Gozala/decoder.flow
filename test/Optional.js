/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

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
  const show = `Decoder.optional(Decoder.${name}, ${JSON.stringify(fallback)})`

  test(show, async test => {
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
  })

  testDecode({ [show]: Decoder.optional(decoder, fallback) }, expect, key =>
    Result.error(`Ran into the following problems:

${fail(key)}
Expecting a null but instead got: \`${key}\`
Expecting an undefined but instead got: \`${key}\``)
  )
}
