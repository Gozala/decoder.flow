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
import type { ArrayDecoder } from "./Array"
import type { DictionaryDecoder, Dictionary } from "./Dictionary"
import type { Error } from "./Error"

export type Decode<a> = a | Error

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
  | FormDecoder<a>
