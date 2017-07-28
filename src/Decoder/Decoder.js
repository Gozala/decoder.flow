/* @flow */

import type { RecordDecoder, Record } from "./Record"
import type { AccessorDecoder } from "./Accessor"
import type { EitherDecoder } from "./Either"
import type { ErrorDecoder } from "./Error"
import type { FieldDecoder } from "./Field"
import type { IndexDecoder } from "./Index"
import type { NullDecoder } from "./Null"
import type { UndefinedDecoder } from "./Undefined"
import type { OkDecoder } from "./Ok"

import type { FloatDecoder, float } from "./Float"
import type { IntegerDecoder, integer } from "./Integer"
import type { StringDecoder } from "./String"
import type { BooleanDecoder } from "./Boolean"
import type { MaybeDecoder } from "./Maybe"
import type { ArrayDecoder } from "./Array"
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
import Field from "./Field"
import Null from "./Null"
import Undefined from "./Undefined"
import Ok from "./Ok"
import Index from "./Index"
import Error from "./Error"

import corrupt from "corrupt"

export type Decode<a> = a | Error

export const decode = <a>(decoder: Decoder<a>, input: mixed): Decode<a> => {
  switch (decoder.type) {
    case "Accessor": {
      return Accessor.decode(decoder, input)
    }
    case "Either": {
      return Either.decode(decoder, input)
    }
    case "Array": {
      return Array.decode(decoder, input)
    }
    case "Dictionary": {
      return DictionaryCodec.decode(decoder, input)
    }
    case "Maybe": {
      return Maybe.decode(decoder, input)
    }
    case "Float": {
      return FloatCodec.decode(decoder, input)
    }
    case "Integer": {
      return IntegerCodec.decode(decoder, input)
    }
    case "String": {
      return StringCodec.decode(decoder, input)
    }
    case "Boolean": {
      return BooleanCodec.decode(decoder, input)
    }
    case "Record": {
      return RecordCodec.decode(decoder, input)
    }
    case "Error": {
      return Error.decode(decoder, input)
    }
    case "Ok": {
      return Ok.decode(decoder, input)
    }
    case "Field": {
      return Field.decode(decoder, input)
    }
    case "Index": {
      return Index.decode(decoder, input)
    }
    case "Null": {
      return Null.decode(decoder, input)
    }
    case "Undefined": {
      return Undefined.decode(decoder, input)
    }
    default: {
      return corrupt(decoder)
    }
  }
}

export type Decoder<a> =
  | AccessorDecoder<a>
  | EitherDecoder<a>
  | ErrorDecoder
  | OkDecoder<a>
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
  | RecordDecoder<a>
