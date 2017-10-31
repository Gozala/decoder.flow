/* @flow */

import type { Decoder, Decode } from "./Decoder"
import Error from "./Error"
import * as Reader from "../Reader"
import type { Record, Fields } from "./Record"

export interface FormDecoder<a> {
  type: "Form";
  form: Fields<a>;
}

export default class Form<a: {}> implements FormDecoder<a> {
  type: "Form" = "Form"
  form: Fields<a>
  constructor(form: Fields<a>) {
    this.form = form
  }
  static read<a: {}>(self: FormDecoder<a>, input: mixed): Decode<a> {
    const { form } = self
    const record: Object = {}
    for (let key of Object.keys(form)) {
      const value = Reader.read(form[key], input)
      if (value instanceof Error) {
        return value
      } else {
        record[key] = value
      }
    }
    return record
  }
}
