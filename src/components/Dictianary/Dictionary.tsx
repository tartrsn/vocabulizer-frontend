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
    {dictionary.filter(({ known }) => !known).map((word) => (
      <Fragment key={`${word.dictionaryWord}_${word.partOfSpeechTag}_${word.entriesInSrc.length}`}>
        <Word
          selected={includes(word.dictionaryWord, selectedWords)}
          word={word}
          onSelect={(word) =>
            includes(word.dictionaryWord, selectedWords)
              ? onSelectWords?.(without([word.dictionaryWord], selectedWords))
              : onSelectWords?.(append(word.dictionaryWord, selectedWords))
          }
          onMarkAsKnown={(word) => onMarkAsKnown?.(word, 'reading')}
        />{' '}
      </Fragment>
    ))}
  </div>
)
