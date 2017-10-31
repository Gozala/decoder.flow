/* @flow */

import type { RecordDecoder, Record } from "./Record"
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
import type { DictionaryDecoder, Dictionary } from "./Dictionary"
import type { Error } from "./Error"

export type Decode<a> = a | Error

export type Decoder<a> = SimpleDecoder<a> | ComplexDecoder<a> | ObjectDecoder<a>

type ComplexDecoder<a> = $Call<
  (<b>(b[]) => ArrayDecoder<b>) &
    (<b>(Dictionary<b>) => DictionaryDecoder<b>) &
    // (<b: {}>(b) => RecordDecoder<a> | FormDecoder<a>) &
    (string => StringDecoder) &
    (boolean => BooleanDecoder) &
    (float => FloatDecoder) &
    (integer => IntegerDecoder) &
    (<b>(?b) => MaybeDecoder<b> | OptionalDecoder<b>),
  a
>

export type ObjectDecoder<a> = $Call<
  (<b: {}>(b) => RecordDecoder<b> | FormDecoder<b>) & (a => empty),
  a
>

export type SimpleDecoder<a> =
  | AccessorDecoder<a>
  | EitherDecoder<a>
  | ErrorDecoder
  | OkDecoder<a>
  | FieldDecoder<a>
  | IndexDecoder<a>
  | NullDecoder<a>
  | UndefinedDecoder<a>
