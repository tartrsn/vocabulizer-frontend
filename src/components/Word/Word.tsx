import React from 'react'
import { DictionaryItem } from '../../utils/getDictionaryFromSrc'
import './Word.css'
import BEM from '../../utils/BEM'

const b = BEM('Word')
type Props = {
  word: DictionaryItem
  onSelect?: (word: DictionaryItem) => void
  onMarkAsKnown?: (word: DictionaryItem) => void
  selected: boolean
}

export const Word: React.FunctionComponent<Props> = ({ word, selected, onSelect, onMarkAsKnown }) => (
  <span className={b({ selected })} onClick={() => onSelect?.(word)}>
    {word.dictionaryWord}
    <sub className={b("count")}>{word.entriesInSrc.length}</sub>
    <sup onClick={(ev) => { ev.stopPropagation(); onMarkAsKnown?.(word)}}>x</sup>
  </span>
)
