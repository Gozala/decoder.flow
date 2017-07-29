/* @flow */

import type { Decode, Decoder } from "./Decoder/Decoder"
import type { float } from "./Decoder/Float"
import type { integer } from "./Decoder/Integer"
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
import Field from "./Decoder/Field"
import Null from "./Decoder/Null"
import Undefined from "./Decoder/Undefined"
import Ok from "./Decoder/Ok"
import Index from "./Decoder/Index"
import Error from "./Decoder/Error"

import * as Reader from "./Reader"
import * as result from "result.flow"

export type Result<a> = result.Result<Error, a>
export type { Decoder, Decode, float, integer, Record, Dictionary, Error }

export const decode = <a>(decoder: Decoder<a>, input: mixed): Result<a> => {
  const value = Reader.read(decoder, input)
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

export const error = <a>(reason: string): Decoder<a> => new Error(reason)

export const field = <a>(name: string, decoder: Decoder<a>): Decoder<a> =>
  new Field(name, decoder)

export const index = <a>(index: number, decoder: Decoder<a>): Decoder<a> =>
  new Index(index, decoder)

export const at = <a>(path: Array<string>, decoder: Decoder<a>): Decoder<a> =>
  path.reduceRight((decoder: Decoder<a>, name) => field(name, decoder), decoder)

export const accessor = <a>(name: string, decoder: Decoder<a>): Decoder<a> =>
  new Accessor(name, decoder)

interface $either {
  <a, b>(Decoder<a>, Decoder<b>): Decoder<a | b>,
  <a, b, c>(Decoder<a>, Decoder<b>, Decoder<c>): Decoder<a | b | c>,
  <a, b, c, d>(
    Decoder<a>,
    Decoder<b>,
    Decoder<c>,
    Decoder<c>
  ): Decoder<a | b | c | d>,
  <a, b, c, d, e>(
    Decoder<a>,
    Decoder<b>,
    Decoder<c>,
    Decoder<c>,
    Decoder<e>
  ): Decoder<a | b | c | d | e>,
  <a, b, c, d, e, f>(
    Decoder<a>,
    Decoder<b>,
    Decoder<c>,
    Decoder<c>,
    Decoder<e>,
    Decoder<f>
  ): Decoder<a | b | c | d | e | f>,
  <a, b, c, d, e, f, g>(
    Decoder<a>,
    Decoder<b>,
    Decoder<c>,
    Decoder<c>,
    Decoder<e>,
    Decoder<f>,
    Decoder<g>
  ): Decoder<a | b | c | d | e | f | g>,
  <a, b, c, d, e, f, g, h>(
    Decoder<a>,
    Decoder<b>,
    Decoder<c>,
    Decoder<c>,
    Decoder<e>,
    Decoder<f>,
    Decoder<g>,
    Decoder<h>
  ): Decoder<a | b | c | d | e | f | g | h>
}

export const either: $either = (...decoders) => new Either(decoders)

export const maybe = <a>(decoder: Decoder<a>): Decoder<?a> => new Maybe(decoder)

export const array = <a>(decoder: Decoder<a>): Decoder<a[]> =>
  new ArrayDecoder(decoder)

export const dictionary = <a>(decoder: Decoder<a>): Decoder<Dictionary<a>> =>
  new DictionaryDecoder(decoder)

export const record = <a: {}>(fields: a): Record<a> => new RecordDecoder(fields)

export const optional = <a>(decoder: Decoder<a>, fallback: a): Decoder<a> =>
  either(decoder, new Null(fallback), new Undefined(fallback))
