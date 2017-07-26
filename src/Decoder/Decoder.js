/* @flow */

import type { RecordDecoder, Record } from "./Record"
import type { AccessorDecoder } from "./Accessor"
import type { EitherDecoder } from "./Either"
import type { FailDecoder } from "./Fail"
import type { FieldDecoder } from "./Field"
import type { IndexDecoder } from "./Index"
import type { NullDecoder } from "./Null"
import type { UndefinedDecoder } from "./Undefined"
import type { SucceedDecoder } from "./Succeed"

import type { FloatDecoder, float } from "./Float"
import type { IntegerDecoder, integer } from "./Integer"
import type { StringDecoder } from "./String"
import type { BooleanDecoder } from "./Boolean"
import type { MaybeDecoder } from "./Maybe"
import type { ArrayDecoder } from "./Array"
import type { EntriesDecoder, Entries } from "./Entries"
import type { DictionaryDecoder, Dictionary } from "./Dictionary"

import FloatCodec from "./Float"
import IntegerCodec from "./Integer"
import StringCodec from "./String"
import BooleanCodec from "./Boolean"
import Maybe from "./Maybe"
import RecordCodec from "./Record"
import Array from "./Array"
import Accessor from "./Accessor"
import DictionaryCodec from "./Dictionary"
import Either from "./Either"
import EntriesCodec from "./Entries"
import Fail from "./Fail"
import Field from "./Field"
import Null from "./Null"
import Undefined from "./Undefined"
import Succeed from "./Succeed"
import Index from "./Index"
import { Bad, Error } from "./Error"

import corrupt from "corrupt"

export type Decode<a> = a | Error

export const decode = <a>(input: mixed, decoder: Decoder<a>): Decode<a> => {
  switch (decoder.type) {
    case "Accessor": {
      return Accessor.decode(input, decoder)
    }
    case "Either": {
      return Either.decode(input, decoder)
    }
    case "Array": {
      return Array.decode(input, decoder)
    }
    case "Dictionary": {
      return DictionaryCodec.decode(input, decoder)
    }
    case "Entries": {
      return EntriesCodec.decode(input, decoder)
    }
    case "Maybe": {
      return Maybe.decode(input, decoder)
    }
    case "Float": {
      return FloatCodec.decode(input, decoder)
    }
    case "Integer": {
      return IntegerCodec.decode(input, decoder)
    }
    case "String": {
      return StringCodec.decode(input, decoder)
    }
    case "Boolean": {
      return BooleanCodec.decode(input, decoder)
    }
    case "Record": {
      return RecordCodec.decode(input, decoder)
    }
    case "Fail": {
      return Fail.decode(input, decoder)
    }
    case "Succeed": {
      return Succeed.decode(input, decoder)
    }
    case "Field": {
      return Field.decode(input, decoder)
    }
    case "Index": {
      return Index.decode(input, decoder)
    }
    case "Null": {
      return Null.decode(input, decoder)
    }
    case "Undefined": {
      return Undefined.decode(input, decoder)
    }
    default: {
      return corrupt(decoder)
    }
  }
}

export type Decoder<a> =
  | AccessorDecoder<a>
  | EitherDecoder<a>
  | FailDecoder<a>
  | SucceedDecoder<a>
  | FieldDecoder<a>
  | IndexDecoder<a>
  | NullDecoder<a>
  | UndefinedDecoder<a>
  | BooleanDecoder<a>
  | FloatDecoder<a>
  | IntegerDecoder<a>
  | StringDecoder<a>
  | MaybeDecoder<*>
  | ArrayDecoder<*>
  | DictionaryDecoder<*>
  | EntriesDecoder<*>
  | RecordDecoder<a>
