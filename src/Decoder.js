/* @flow */

import type { Decode, Decoder } from "./Decoder/Decoder"
import type { float } from "./Decoder/Float"
import type { integer } from "./Decoder/Integer"
import type { Dictionary } from "./Decoder/Dictionary"
import type { Record, Fields } from "./Decoder/Record"

import StringDecoder from "./Decoder/String"
import BooleanDecoder from "./Decoder/Boolean"
import IntegerDecoder from "./Decoder/Integer"
import FloatDecoder from "./Decoder/Float"
import Maybe from "./Decoder/Maybe"
import Optional from "./Decoder/Optional"
import RecordDecoder from "./Decoder/Record"
import Form from "./Decoder/Form"
import ArrayDecoder from "./Decoder/Array"
import Accessor from "./Decoder/Accessor"
import DictionaryDecoder from "./Decoder/Dictionary"
import Either from "./Decoder/Either"
import Field from "./Decoder/Field"
import Null from "./Decoder/Null"
import Undefined from "./Decoder/Undefined"
import Ok from "./Decoder/Ok"
import Index from "./Decoder/Index"
import And from "./Decoder/And"
import Error from "./Decoder/Error"

import * as Variant from "./Decoder/Decoder"
import * as result from "result.flow"

export type Result<a> = result.Result<Error, a>
export type {
  Decoder,
  Decode,
  float,
  integer,
  Record,
  Fields,
  Dictionary,
  Error
}

class ParseError extends Error {
  name = "ParseError"
  error: { message: string }
  constructor(error: { message: string }) {
    super()
    this.error = error
  }
  describe(context: string): string {
    return `Parse error: ${this.error.message}`
  }
}

/**
 * Parses given `input` string into a JSON value and then runs given
 * `Decoder<a>` on it. Returns `Result` with `Result.Error<Decoder.ParseError>`
 * if the string is not well-formed JSON or `Result.Error<Decoder.Error>` if
 * the value can't be decoded with a given `Decoder<a>`. If operation is
 * successfull returns `Result.Ok<a>`.
 */
export const parse = <a>(decoder: Decoder<a>, input: string): Result<a> => {
  try {
    return decode(decoder, JSON.parse(input))
  } catch (error) {
    return result.error(new ParseError(error))
  }
}

/**
 * Runs given `Decoder<a>` on a given JSON value. Returns `Result` that either
 * contains `Decoder.Error` if value can't be decoded with a given decoder or
 * a `Result.Ok<a>`.
 */
export const decode = <a>(decoder: Decoder<a>, json: mixed): Result<a> => {
  const value = Variant.decode(decoder, json)
  if (value instanceof Error) {
    return result.error(value)
  } else {
    return result.ok(value)
  }
}

export const String: Decoder<string> = new StringDecoder()

export const Boolean: Decoder<boolean> = new BooleanDecoder()

export const Float: Decoder<float> = new FloatDecoder()

export const Integer: Decoder<integer> = new IntegerDecoder()

export const ok = <a>(value: a): Decoder<a> => new Ok(value)

export const error = <a>(reason: string): Decoder<a> => new Error(reason)

export const field = <a>(name: string, decoder: Decoder<a>): Decoder<a> =>
  new Field(name, decoder)

export const at = <a>(path: string[], decoder: Decoder<a>): Decoder<a> =>
  path.reduceRight((decoder: Decoder<a>, name) => field(name, decoder), decoder)

export const index = <a>(index: number, decoder: Decoder<a>): Decoder<a> =>
  new Index(index, decoder)

export const accessor = <a>(name: string, decoder: Decoder<a>): Decoder<a> =>
  new Accessor(name, decoder)

export const either = <a>(...decoders: Decoder<a>[]): Decoder<a> =>
  new Either(decoders)

export const and = <a, b>(left: Decoder<a>, right: Decoder<b>): Decoder<b> =>
  new And(left, right)

export const maybe = <a>(decoder: Decoder<a>): Decoder<?a> =>
  (new Maybe(decoder): Decoder<?a>)

export const array = <a>(decoder: Decoder<a>): Decoder<a[]> =>
  (new ArrayDecoder(decoder): Decoder<a[]>)

export const dictionary = <a>(decoder: Decoder<a>): Decoder<Dictionary<a>> =>
  (new DictionaryDecoder(decoder): Decoder<Dictionary<a>>)

export const form = <a: {}>(fields: a): Record<a> =>
  (new Form(fields): Record<a>)

export const record = <a: {}>(fields: a): Record<a> =>
  (new RecordDecoder(fields): Record<a>)

export const optional = <a>(decoder: Decoder<a>): Decoder<?a> =>
  (new Optional(decoder): Decoder<?a>)

export const annul = <a>(value: a): Decoder<a> => new Null(value)

export const avoid = <a>(value: a): Decoder<a> => new Undefined(value)
