/* @noflow */

import * as Decoder from "../"
import test from "blue-tape"

test("test baisc", async test => {
  test.isEqual(typeof Decoder, "object")
})
