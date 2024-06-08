import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import isDate from 'lodash/isDate'
import isNumber from 'lodash/isNumber'
import isBoolean from 'lodash/isBoolean'
import isFunction from 'lodash/isFunction'
import isNil from 'lodash/isNil'
import isNull from 'lodash/isNull'
import isUndefined from 'lodash/isUndefined'
import isEmpty from 'lodash/isEmpty'
import isPlainObject from 'lodash/isPlainObject'
import isElement from 'lodash/isElement'
import isArguments from 'lodash/isArguments'
import isMap from 'lodash/isMap'
import isSet from 'lodash/isSet'
import isWeakMap from 'lodash/isWeakMap'
import isWeakSet from 'lodash/isWeakSet'
import isSymbol from 'lodash/isSymbol'
import isRegExp from 'lodash/isRegExp'
import isNaN from 'lodash/isNaN'
import isFinite from 'lodash/isFinite'
import isInteger from 'lodash/isInteger'
import isSafeInteger from 'lodash/isSafeInteger'
import isLength from 'lodash/isLength'
import isMatch from 'lodash/isMatch'
import isMatchWith from 'lodash/isMatchWith'

export const isNotEmpty = <T>(value: T): boolean => {
  return value !== undefined && value !== null
}

export const isNestedObjectEmpty = <T>(obj: T): boolean => {
  if (typeof obj === 'object') {
    let isEmpty = true
    for (const key in obj) {
      if (typeof obj[key] !== 'object' && isNotEmpty(obj[key])) {
        isEmpty = false
        break
      } else if (!isNestedObjectEmpty(obj[key])) {
        isEmpty = false
        break
      }
    }
    return isEmpty
  }

  return false
}

export {
  isArray,
  isObject,
  isString,
  isDate,
  isNumber,
  isBoolean,
  isFunction,
  isNil,
  isNull,
  isUndefined,
  isEmpty,
  isPlainObject,
  isElement,
  isArguments,
  isMap,
  isSet,
  isWeakMap,
  isWeakSet,
  isSymbol,
  isRegExp,
  isNaN,
  isFinite,
  isInteger,
  isSafeInteger,
  isLength,
  isMatch,
  isMatchWith,
}
