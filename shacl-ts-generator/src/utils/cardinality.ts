import { CardinalityInfo } from "../model/cardinality.js"

export function interpretCardinality(
  minCount?: number,
  maxCount?: number
): CardinalityInfo {

  const min = minCount ?? 0

  return {
    required: min >= 1,
    singular: maxCount === 1,
    multiple: maxCount === undefined || maxCount > 1
  }
}