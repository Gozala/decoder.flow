/* @flow */

import type { Decoder, Error } from "../.."
import type { Result } from "result.flow"
import { decode } from "../.."
import tape from "blue-tape"

const test = <a>(
  decoders: { [string]: Decoder<a> },
  out: { [string]: mixed },
  expect: string => mixed,
  inn: { [string]: mixed } = input
) => {
  for (const id of Object.keys(decoders)) {
    const name = id
    const decoder = decoders[name]
    tape(name, async test => {
      for (let key of Object.keys(inn)) {
        test.deepEqual(
          decode(decoder, inn[key]).format(error => error.message),
          out[key] || expect(key),
          `Decoder.decode(${name}, ${key})`
        )
      }
    })
  }
}

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
  "{}": {},
  '{"a":2}': { a: 2 },
  '{"b":{"c":4.3}}': { b: { c: 4.3 } },
  '{"a":"A","b":{"c":{"d":4}}}': { a: "A", b: { c: { d: 4 } } },
  '{"fn":true,"v":1}': {
    fn: true,
    v: 1,
    invoke() {
      return 2
    }
  },
  '{"fn":true,"v":2}': {
    fn: true,
    v: 2,
    invoke() {
      return 2.2
    }
  }
}

export default test
