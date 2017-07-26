/* @flow */

import type { Decoder, Decode } from "./Decoder"

interface Codec<a> {
  (input: mixed, decoder: Decoder<a>): Decode<a>,
  <a>(input: mixed, decoder: Decoder<a>): empty
}

type CodecDecoder = <a>(mixed, Decoder<a>) => Decode<a>

export default <a>(decode: Codec<a>): CodecDecoder => decode
