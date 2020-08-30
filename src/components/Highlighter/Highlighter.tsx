import React, { useMemo } from 'react'
import { append, flatten, isEmpty, last, map, reduce, slice } from 'ramda'
import { Range } from '../../utils/inrervals'
import './Highlighter.css'
import BEM from '../../utils/BEM'

const b = BEM('Highlighter')

type Highlight = [string, boolean]
const splitByRanges = (src: string, ranges: Range[]): Highlight[] => {
  if (isEmpty(ranges)) return [[src, false]]

  const breakpoints = flatten(map(({ start, end }) => [start, end], ranges))
  const result = reduce<number, [Highlight[], number, boolean]>(
    ([result, from, isHighlighted], to) => [
      append([slice(from, to, src), isHighlighted], result), //
      to, //
      !isHighlighted,
    ],
    [[], 0, false],
    breakpoints,
  )

  return append([slice(last(breakpoints) ?? src.length, src.length, src), false], result[0])
}

export const Highlighter: React.FunctionComponent<{ highlighters: Range[]; text: string }> = ({
  highlighters,
  text,
}) => {
  const model = useMemo(() => splitByRanges(text, highlighters), [highlighters, text])

  return (
    <span className={b()}>
      {model.map(([text, isHighlighted]) => (
        <span className={b('item', { active: isHighlighted })}>{text}</span>
      ))}
    </span>
  )
}
