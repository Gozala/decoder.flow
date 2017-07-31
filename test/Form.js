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

test("Decode.from same thing", async test => {
  const decoder = Decoder.form({
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
  })

  const result = Decoder.decode(decoder, {
    title: "/usr/local/bin/node",
    cwd() {
      return "~/Projects/decoder.flow/test/"
    },
    config: {
      target_defaults: {
        cflags: [],
        default_configuration: "Release",
        defines: [],
        include_dirs: [],
        libraries: []
      },
      variables: {
        asan: 0,
        coverage: false,
        debug_devtools: "node",
        force_dynamic_crt: 0,
        host_arch: "x64"
      }
    },
    memoryUsage() {
      return {
        rss: 34304000,
        heapTotal: 7340032,
        heapUsed: 5720104,
        external: 8666
      }
    }
  })

  test.deepEqual(
    result,
    Result.ok({
      title: "/usr/local/bin/node",
      cwd: "~/Projects/decoder.flow/test/",
      architecture: "x64",
      heapUsed: 5720104
    })
  )
})
