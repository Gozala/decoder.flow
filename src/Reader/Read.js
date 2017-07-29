/* @flow */

import type { Decoder, Decode } from "../Decoder/Decoder"

interface Reader<a> {
  (decoder: Decoder<a>, input: mixed): Decode<a>,
  <a>(decoder: Decoder<a>, input: mixed): empty
}

type Read = <a>(Decoder<a>, mixed) => Decode<a>

export default <a>(decode: Reader<a>): Read => decode
