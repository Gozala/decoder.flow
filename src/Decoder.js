/* @flow */

import type { Decode, Decoder } from "./Decoder/Decoder"
import type { float } from "./Decoder/Float"
import type { integer } from "./Decoder/Integer"
import type { Entries } from "./Decoder/Entries"
import type { Dictionary } from "./Decoder/Dictionary"
import type { Record } from "./Decoder/Record"

import StringDecoder from "./Decoder/String"
import BooleanDecoder from "./Decoder/Boolean"
import IntegerDecoder from "./Decoder/Integer"
import FloatDecoder from "./Decoder/Float"
import Maybe from "./Decoder/Maybe"
import RecordDecoder from "./Decoder/Record"
import ArrayDecoder from "./Decoder/Array"
import Accessor from "./Decoder/Accessor"
import DictionaryDecoder from "./Decoder/Dictionary"
import Either from "./Decoder/Either"
import EntriesDecoder from "./Decoder/Entries"
import Fail from "./Decoder/Fail"
import Field from "./Decoder/Field"
import Null from "./Decoder/Null"
import Undefined from "./Decoder/Undefined"
import Succeed from "./Decoder/Succeed"
import Index from "./Decoder/Index"
import { Bad, Error } from "./Decoder/Error"

import * as Reader from "./Decoder/Decoder"
import * as result from "result.flow"

export type Result<a> = result.Result<Error, a>
export type { Decoder, Decode, float, integer, Record, Dictionary, Entries }

export const decode = <a>(input: mixed, decoder: Decoder<a>): Result<a> => {
  const value = Reader.decode(input, decoder)
  if (value instanceof Error) {
    return result.error(value)
  } else {
    return result.ok(value)
  }
}

export const String: Decoder<string> = new StringDecoder()
export const Boolean: Decoder<boolean> = new BooleanDecoder()
export const Integer: Decoder<integer> = new IntegerDecoder()
export const Float: Decoder<float> = new FloatDecoder()

export const fail = <a>(reason: string): Decoder<a> => new Fail(reason)

export const field = <a>(name: string, decoder: Decoder<a>): Decoder<a> =>
  new Field(name, decoder)

export const index = <a>(index: number, decoder: Decoder<a>): Decoder<a> =>
  new Index(index, decoder)

export const at = <a>(path: Array<string>, decoder: Decoder<a>): Decoder<a> =>
  path.reduce((decoder: Decoder<a>, name) => field(name, decoder), decoder)

export const accessor = <a>(name: string, decoder: Decoder<a>): Decoder<a> =>
  new Accessor(name, decoder)

export const either = <a>(
  first: Decoder<a>,
  second: Decoder<a>,
  ...rest: Array<Decoder<a>>
): Decoder<a> => new Either([first, second, ...rest])

export const maybe = <a>(decoder: Decoder<a>): Decoder<?a> => new Maybe(decoder)

export const array = <a>(decoder: Decoder<a>): Decoder<a[]> =>
  new ArrayDecoder(decoder)

export const dictionary = <a>(decoder: Decoder<a>): Decoder<Dictionary<a>> =>
  new DictionaryDecoder(decoder)

export const entries = <a>(decoder: Decoder<a>): Decoder<Entries<a>> =>
  new EntriesDecoder(decoder)

export const record = <a: {}>(fields: a): Record<a> => new RecordDecoder(fields)

export const optional = <a>(decoder: Decoder<a>, fallback: a): Decoder<a> =>
  either(decoder, new Null(fallback), new Undefined(fallback))

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
