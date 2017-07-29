/* @flow */

import * as Decoder from "../"
import * as Result from "result.flow"
import test from "blue-tape"
import testDecode from "./Decoder/Decoder"

test("Decoder.form", async test => {
  test.deepEqual(
    Decoder.form({
      x: Decoder.field("x", Decoder.Float),
      y: Decoder.field("y", Decoder.Float)
    }),
    {
      type: "Form",
      form: {
        x: {
          type: "Field",
          name: "x",
          field: { type: "Float" }
        },
        y: {
          type: "Field",
          name: "y",
          field: { type: "Float" }
        }
      }
    },
    'Decoder.form({x:Decoder.field("x", Decoder.Float),y:Decoder.field("y", Decoder.Float)})'
  )

  test.deepEqual(
    Decoder.form({}),
    {
      type: "Form",
      form: {}
    },
    "Decoder.form({})"
  )
})

testDecode(
  {
    'Decoder.form({x:Decoder.field("x", Decoder.Float),y:Decoder.field("y", Decoder.Float)})': Decoder.form(
      {
        x: Decoder.field("x", Decoder.Float),
        y: Decoder.field("y", Decoder.Float)
      }
    ),
    '{"type":"Form","form":{x:..., y:...}}': ({
      type: "Form",
      form: {
        x: {
          type: "Field",
          name: "x",
          field: { type: "Float" }
        },
        y: {
          type: "Field",
          name: "y",
          field: { type: "Float" }
        }
      }
    }: any)
  },
  {},
  key =>
    Result.error(
      `Expecting an object with a field named 'x' but instead got: \`${key}\``
    )
)

testDecode(
  {
    "Decoder.form({})": Decoder.form({}),
    '{type: "Form",form: {}}': ({
      type: "Form",
      form: {}
    }: any)
  },
  {},
  key => Result.ok({})
)
