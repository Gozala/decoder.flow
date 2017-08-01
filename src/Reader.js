/* @flow */

import type { Decoder, Decode } from "./Decoder/Decoder"

import FloatCodec from "./Decoder/Float"
import IntegerCodec from "./Decoder/Integer"
import StringCodec from "./Decoder/String"
import BooleanCodec from "./Decoder/Boolean"
import Maybe from "./Decoder/Maybe"
import RecordCodec from "./Decoder/Record"
import Optional from "./Decoder/Optional"
import Form from "./Decoder/Form"
import Array from "./Decoder/Array"
import Accessor from "./Decoder/Accessor"
import DictionaryCodec from "./Decoder/Dictionary"
import Either from "./Decoder/Either"
import Field from "./Decoder/Field"
import Null from "./Decoder/Null"
import Undefined from "./Decoder/Undefined"
import Ok from "./Decoder/Ok"
import Index from "./Decoder/Index"
import Error from "./Decoder/Error"

import corrupt from "corrupt"

export const read = <a>(decoder: Decoder<a>, input: mixed): Decode<a> => {
  switch (decoder.type) {
    case "Accessor": {
      return Accessor.read(decoder, input)
    }
    case "Either": {
      return Either.read(decoder, input)
    }
    case "Array": {
      return Array.read(decoder, input)
    }
    case "Dictionary": {
      return DictionaryCodec.read(decoder, input)
    }
    case "Maybe": {
      return Maybe.read(decoder, input)
    }
    case "Optional": {
      return Optional.read(decoder, input)
    }
    case "Float": {
      return FloatCodec.read(decoder, input)
    }
    case "Integer": {
      return IntegerCodec.read(decoder, input)
    }
    case "String": {
      return StringCodec.read(decoder, input)
    }
    case "Boolean": {
      return BooleanCodec.read(decoder, input)
    }
    case "Record": {
      return RecordCodec.read(decoder, input)
    }
    case "Form": {
      return Form.read(decoder, input)
    }
    case "Error": {
      return Error.read(decoder, input)
    }
    case "Ok": {
      return Ok.read(decoder, input)
    }
    case "Field": {
      return Field.read(decoder, input)
    }
    case "Index": {
      return Index.read(decoder, input)
    }
    case "Null": {
      return Null.read(decoder, input)
    }
    case "Undefined": {
      return Undefined.read(decoder, input)
    }
    default: {
      return corrupt(decoder)
    }
  }
}
