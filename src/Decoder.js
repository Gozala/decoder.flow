/* @flow */

import type { Decode, Decoder } from "./Decoder/Decoder"
import type { float } from "./Decoder/Float"
import type { integer } from "./Decoder/Integer"
import type { Entries } from "./Decoder/Entries"
import type { Dictionary } from "./Decoder/Dictionary"
import type { Record } from "./Decoder/Record"
import type { Result } from "result.flow"

import FloatCodec from "./Decoder/Float"
import IntegerCodec from "./Decoder/Integer"
import StringCodec from "./Decoder/String"
import BooleanCodec from "./Decoder/Boolean"
import MaybeCodec from "./Decoder/Maybe"
import RecordCodec from "./Decoder/Record"
import ArrayCodec from "./Decoder/Array"
import AccessorCodec from "./Decoder/Accessor"
import DictionaryCodec from "./Decoder/Dictionary"
import EitherCodec from "./Decoder/Either"
import EntriesCodec from "./Decoder/Entries"
import FailCodec from "./Decoder/Fail"
import FieldCodec from "./Decoder/Field"
import NullCodec from "./Decoder/Null"
import UndefinedCodec from "./Decoder/Undefined"
import SucceedCodec from "./Decoder/Succeed"
import IndexCodec from "./Decoder/Index"
import { Bad, Error } from "./Decoder/Error"

import * as Reader from "./Decoder/Decoder"
import { ok, error } from "result.flow"

export const decode = <a>(
  input: mixed,
  decoder: Decoder<a>
): Result<Error, a> => {
  const value = Reader.decode(input, decoder)
  if (value instanceof Error) {
    return error(value)
  } else {
    return ok(value)
  }
}

export const String: Decoder<string> = { type: "String" }
export const Boolean: Decoder<boolean> = { type: "Boolean" }
export const Integer: Decoder<integer> = { type: "Integer" }
export const Float: Decoder<float> = { type: "Float" }

export const fail = <a>(reason: string): Decoder<a> => {
  const fail = new FailCodec()
  fail.reason = reason
  return fail
}

export const field = <a>(name: string, decoder: Decoder<a>): Decoder<a> => {
  const field = new FieldCodec()
  field.field = decoder
  return field
}

export const index = <a>(index: number, decoder: Decoder<a>): Decoder<a> => {
  const indexDecoder = new IndexCodec()
  indexDecoder.index = index
  indexDecoder.member = decoder
  return indexDecoder
}

export const at = <a>(path: Array<string>, decoder: Decoder<a>): Decoder<a> =>
  path.reduce((decoder: Decoder<a>, name) => field(name, decoder), decoder)

export const accessor = <a>(name: string, decoder: Decoder<a>): Decoder<a> => {
  const accessor = new AccessorCodec()
  accessor.name = name
  accessor.accessor = decoder
  return accessor
}

export const either = <a>(
  first: Decoder<a>,
  second: Decoder<a>,
  ...rest: Array<Decoder<a>>
): Decoder<a> => {
  const either = new EitherCodec()
  either.either = [first, second, ...rest]
  return either
}

export const maybe = <a>(decoder: Decoder<a>): Decoder<?a> => {
  const maybe = new MaybeCodec()
  maybe.some = decoder
  return maybe
}

export const array = <a>(decoder: Decoder<a>): Decoder<a[]> => {
  const array = new ArrayCodec()
  array.elementDecoder = decoder
  return array
}

export const dictionary = <a>(decoder: Decoder<a>): Decoder<Dictionary<a>> => {
  const dictionary = new DictionaryCodec()
  dictionary.valueDecoder = decoder
  return dictionary
}

export const entries = <a>(decoder: Decoder<a>): Decoder<Entries<a>> => {
  const entries = new EntriesCodec()
  entries.entry = decoder
  return entries
}

export const record = <a: {}>(fields: a): Record<a> => {
  const record = new RecordCodec()
  record.fields = fields
  return record
}

export const optional = <a>(decoder: Decoder<a>, fallback: a): Decoder<a> => {
  const nullDecoder = new NullCodec()
  nullDecoder.fallback = fallback
  const undefinedDecoder = new UndefinedCodec()
  undefinedDecoder.fallback = fallback
  return either(decoder, nullDecoder, undefinedDecoder)
}

var name = decode("foo", String)

var point = record({ x: Float, y: Float })
var p = decode("", point)
if (p.isOk) {
  p.value.x + p.value.y
}

// const point3d = record.field("x", Float).field("y", Float).field("z", Float)
// var p2 = decode("{}", point3d)
// if (!(p2 instanceof Error)) {
//   p2.x + p2.y + p2.z
// }
