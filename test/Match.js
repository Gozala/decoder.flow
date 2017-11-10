/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.field", async test => {
  test.deepEqual(
    Decoder.match(15),
    {
      type: "Match",
      match: 15
    },
    "Decoder.match(15)"
  )

  test.deepEqual(
    Decoder.match({ foo: "bar" }),
    {
      type: "Match",
      match: { foo: "bar" }
    },
    'Decoder.match({ foo:"bar" })'
  )
})

testDecode(
  {
    "Decoder.match(15)": Decoder.match(15),
    '{type:"Match", match:15}': {
      type: "Match",
      match: 15
    }
  },
  {
    "15": Result.ok(15)
  },
  key => Result.error(`Expecting \`15\` but instead got: \`${key}\``)
)

testDecode(
  {
    "Decoder.match([])": Decoder.match([]),
    '{type:"Match", match:[]}': {
      type: "Match",
      match: []
    }
  },
  {
    "[]": Result.ok([]),
    "[7]": Result.ok([]),
    '["foo"]': Result.ok([]),
    "[true]": Result.ok([]),
    "[false]": Result.ok([]),
    "[1.1,2,3,4]": Result.ok([]),
    '[["a","b","c","d"]]': Result.ok([])
  },
  key => Result.error(`Expecting \`[]\` but instead got: \`${key}\``)
)

testDecode(
  {
    "Decoder.match([true])": Decoder.match([["a"]]),
    '{type:"Match", match:[["a"]]}': {
      type: "Match",
      match: [["a"]]
    }
  },
  {
    '[["a","b","c","d"]]': Result.ok([["a"]])
  },
  key => Result.error(`Expecting \`[["a"]]\` but instead got: \`${key}\``)
)

testDecode(
  {
    'Decoder.match("")': Decoder.match(""),
    '{type:"Match", match:""': {
      type: "Match",
      match: ""
    }
  },
  {
    '""': Result.ok("")
  },
  key => Result.error(`Expecting \`""\` but instead got: \`${key}\``)
)

testDecode(
  {
    'Decoder.match(new String("Hello"))': Decoder.match(new String("Hello")),
    '{type:"Match", match:new String("Hello")': {
      type: "Match",
      match: new String("Hello")
    }
  },
  {
    'new String("Hello")': Result.ok(new String("Hello"))
  },
  key =>
    Result.error(
      `Expecting \`new String("Hello")\` but instead got: \`${key}\``
    )
)

testDecode(
  {
    'Decoder.match(new String("Hello"))': Decoder.match(null),
    '{type:"Match", match:null': {
      type: "Match",
      match: null
    }
  },
  {
    null: Result.ok(null)
  },
  key => Result.error(`Expecting \`null\` but instead got: \`${key}\``)
)

testDecode(
  {
    "Decoder.match({})": Decoder.match({}),
    '{type:"Match", match:{}': {
      type: "Match",
      match: {}
    }
  },
  {
    "new Boolean(true)": Result.ok({}),
    "new Boolean(false)": Result.ok({}),
    "new Number(0)": Result.ok({}),
    "new Number(-15)": Result.ok({}),
    "new Number(15)": Result.ok({}),
    "new Number(0.2)": Result.ok({}),
    "new Number(-9.8)": Result.ok({}),
    'new String("")': Result.ok({}),
    'new String("Hello")': Result.ok({}),
    "[]": Result.ok({}),
    "[7]": Result.ok({}),
    '["foo"]': Result.ok({}),
    "[true]": Result.ok({}),
    "[false]": Result.ok({}),
    "[1.1,2,3,4]": Result.ok({}),
    '[["a","b","c","d"]]': Result.ok({}),
    "{}": Result.ok({}),
    '{"a":2}': Result.ok({}),
    '{"b":{"c":4.3}}': Result.ok({}),
    '{"a":"A","b":{"c":{"d":4}}}': Result.ok({}),
    '{"fn":true,"v":1}': Result.ok({}),
    '{"fn":true,"v":2}': Result.ok({})
  },
  key => Result.error(`Expecting \`{}\` but instead got: \`${key}\``)
)

testDecode(
  {
    "Decoder.match({length:1})": Decoder.match({ length: 1 }),
    '{type:"Match", match:{length:1}': {
      type: "Match",
      match: { length: 1 }
    }
  },
  {
    "[7]": Result.ok({ length: 1 }),
    '["foo"]': Result.ok({ length: 1 }),
    "[true]": Result.ok({ length: 1 }),
    "[false]": Result.ok({ length: 1 }),
    '[["a","b","c","d"]]': Result.ok({ length: 1 })
  },
  key => Result.error(`Expecting \`{"length":1}\` but instead got: \`${key}\``)
)

testDecode(
  {
    'Decoder.match({"a":"A"})': Decoder.match({ a: "A" }),
    '{type:"Match", match:{"a":"A"}': {
      type: "Match",
      match: { a: "A" }
    }
  },
  {
    '{"a":"A","b":{"c":{"d":4}}}': Result.ok({ a: "A" })
  },
  key => Result.error(`Expecting \`{"a":"A"}\` but instead got: \`${key}\``)
)
