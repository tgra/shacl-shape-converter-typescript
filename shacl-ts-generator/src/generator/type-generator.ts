import { CardinalityInfo } from "../model/cardinality.js"

export function generatePropertyType(
  baseType: string,
  cardinality: CardinalityInfo
): string {

  if (cardinality.multiple) {
    return `${baseType}[]`
  }

  if (cardinality.required) {
    return baseType
  }

  return `${baseType} | undefined`
}

export function generateSetterType(
  baseType: string,
  cardinality: CardinalityInfo
): string {

  if (cardinality.multiple) {
    return `${baseType}[]`
  }

  return cardinality.required
    ? baseType
    : `${baseType} | undefined`
}