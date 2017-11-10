/* @flow */

import type { RecordDecoder } from "./Record"
import type { FormDecoder } from "./Form"
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
import type { OptionalDecoder } from "./Optional"
import type { ArrayDecoder } from "./Array"
import type { DictionaryDecoder } from "./Dictionary"
import type { MatchDecoder } from "./Match"
import type { AndDecoder } from "./And"

export type Decode<a> = a | Error

export type Decoder<+a> =
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
  | OptionalDecoder<*, a>
  | MaybeDecoder<*, a>
  | ArrayDecoder<*, a>
  | DictionaryDecoder<*, a>
  | RecordDecoder<a>
  | FormDecoder<a>
  | AndDecoder<*, a>
  | MatchDecoder<a>

import Float from "./Float"
import Integer from "./Integer"
import String from "./String"
import Boolean from "./Boolean"
import Maybe from "./Maybe"
import Optional from "./Optional"
import Record from "./Record"
import Form from "./Form"
import Array from "./Array"
import Accessor from "./Accessor"
import Dictionary from "./Dictionary"
import Either from "./Either"
import Field from "./Field"
import Null from "./Null"
import Undefined from "./Undefined"
import Ok from "./Ok"
import Index from "./Index"
import Error from "./Error"
import And from "./And"
import unreachable from "unreachable"

export const decode = <a>(decoder: Decoder<a>, input: mixed): Decode<a> => {
  switch (decoder.type) {
    case "Accessor": {
      return Accessor.decode(decoder.name, decoder.accessor, input)
    }
    case "Either": {
      return Either.decode(decoder.either, input)
    }
    case "Array": {
      return (Array.decode(decoder.array, input): any)
    }
    case "Dictionary": {
      return (Dictionary.decode(decoder.dictionary, input): any)
    }
    case "Maybe": {
      return (Maybe.decode(decoder.maybe, input): any)
    }
    case "Optional": {
      return (Optional.decode(decoder.optional, input): any)
    }
    case "Float": {
      return (Float.decode(input): any)
    }
    case "Integer": {
      return (Integer.decode(input): any)
    }
    case "String": {
      return (String.decode(input): any)
    }
    case "Boolean": {
      return (Boolean.decode(input): any)
    }
    case "Record": {
      return (Record.decode((decoder.fields: any), input): any)
    }
    case "Form": {
      return (Form.decode((decoder.form: any), input): any)
    }
    case "Error": {
      return Error.decode(decoder, input)
    }
    case "Ok": {
      return Ok.decode(decoder.value, input)
    }
    case "Field": {
      return Field.decode(decoder.name, decoder.field, input)
    }
    case "Index": {
      return Index.decode(decoder.index, decoder.member, input)
    }
    case "Null": {
      return Null.decode(decoder.Null, input)
    }
    case "Undefined": {
      return Undefined.decode(decoder.Undefined, input)
    }
    case "And": {
      return And.decode(decoder.left, decoder.right, input)
    }
    default: {
      return unreachable(decoder)
    }
  }
}
