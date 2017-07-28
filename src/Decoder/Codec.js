/* @flow */

import type { Decoder, Decode } from "./Decoder"

interface Codec<a> {
  (decoder: Decoder<a>, input: mixed): Decode<a>,
  <a>(decoder: Decoder<a>, input: mixed): empty
}

type CodecDecoder = <a>(Decoder<a>, mixed) => Decode<a>

export default <a>(decode: Codec<a>): CodecDecoder => decode
