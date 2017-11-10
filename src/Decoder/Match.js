/* @flow */

import type { Decoder, Decode } from "./Decoder"
import { MissmatchError } from "./Error"

export interface MatchDecoder<+a> {
  type: "Match";
  match: a;
}

const matches = <a>(actual: a, expected: a): boolean => {
  if (actual === expected) {
    return true
  } else {
    if (
      actual &&
      typeof actual === "object" &&
      expected &&
      typeof expected === "object"
    ) {
      if (Array.isArray(expected)) {
        if (Array.isArray(actual)) {
          const count = expected.length
          let index = 0
          let isMatch = count <= actual.length
          while (isMatch && index < count) {
            isMatch = matches(actual[index], expected[index])
            index++
          }
          return isMatch
        } else {
          return false
        }
      } else {
        for (const key in expected) {
          if (Object.prototype.hasOwnProperty.call(expected, key)) {
            if (!matches(actual[key], expected[key])) {
              return false
            }
          }
        }
        return true
      }
    } else {
      return false
    }
  }
}

export default class Match<a> implements MatchDecoder<a> {
  type: "Match" = "Match"
  match: a
  constructor(match: a) {
    this.match = match
  }
  static decode<a>(match: a, input: mixed): Decode<a> {
    if (matches(input, match)) {
      return match
    } else {
      return new MissmatchError(input, match)
    }
  }
}
