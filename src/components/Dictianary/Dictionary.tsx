import React, { Fragment } from 'react'
import { DictionaryItem } from '../../utils/getDictionaryFromSrc'
import { Word } from '../Word/Word'
import './Dictionary.css'
import BEM from '../../utils/BEM'
import { append, includes, without } from 'ramda'

const b = BEM('Dictionary')

type Props = {
  selectedWords: string[]
  dictionary: DictionaryItem[]
  onSelectWords?: (words: string[]) => void
  onMarkAsKnown?: (word: DictionaryItem, source?: string) => void
}

export const Dictionary: React.FunctionComponent<Props> = ({ dictionary, selectedWords, onSelectWords, onMarkAsKnown }) => (
  <div className={b()}>
    {dictionary
      .filter(({ known }) => !known)
      .map(word => ({ word, selected: includes(word.dictionaryWord, selectedWords) }))
      .sort((a, b) => Number(a.selected) - Number(b.selected))
      .map(({word, selected}) => (
      <Fragment key={`${word.dictionaryWord}_${word.partOfSpeechTag}_${word.entriesInSrc.length}`}>
        <Word
          selected={selected}
          word={word}
          onSelect={(word) =>
            selected
              ? onSelectWords?.(without([word.dictionaryWord], selectedWords))
              : onSelectWords?.(append(word.dictionaryWord, selectedWords))
          }
          onMarkAsKnown={(word) => onMarkAsKnown?.(word, 'reading')}
        />{' '}
      </Fragment>
    ))}
  </div>
)
