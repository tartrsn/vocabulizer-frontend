import { concat, init, isEmpty, last, reduce } from 'ramda'

export type Range = { start: number; end: number }

export const mergeTwoIntervals = (A: Range, B: Range): Range[] => {
  const AStart = A.start
  const AEnd = A.end

  const BStart = B.start
  const BEnd = B.end

  if (AEnd < BStart) return [A, B] // [--A--] ___ [--B--]
  if (BEnd < AStart) return [B, A] // [--B--] ___ [--A--]

  if (AStart <= BStart && AEnd >= BEnd) return [A] // [ A- [--B--] -A]
  if (BStart <= AStart && BEnd >= AEnd) return [B] // [ B- [--A--] -B]

  if (AStart <= BStart && AEnd <= BEnd) return [{ start: A.start, end: B.end }] // [A-- [B --A] --B]
  if (BStart <= AStart && BEnd <= AEnd) return [{ start: B.start, end: A.end }] // [B-- [A --B] --A]

  return [A, B]
}

export const mergeIntervals = reduce<Range, Range[]>(
  (result, interval) =>
    isEmpty(result) ? [interval] : concat(init(result), mergeTwoIntervals(last(result) as Range, interval)),
  [],
)
