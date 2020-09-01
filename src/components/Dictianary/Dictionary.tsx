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
}

export const Dictionary: React.FunctionComponent<Props> = ({ dictionary, selectedWords, onSelectWords }) => (
  <div className={b()}>
    {dictionary.map((word) => (
      <Fragment key={`${word.dictionaryWord}_${word.entriesInSrc.length}`}>
        <Word
          selected={includes(word.dictionaryWord, selectedWords)}
          word={word}
          onSelect={(word) =>
            includes(word.dictionaryWord, selectedWords)
              ? onSelectWords?.(without([word.dictionaryWord], selectedWords))
              : onSelectWords?.(append(word.dictionaryWord, selectedWords))
          }
        />{' '}
      </Fragment>
    ))}
  </div>
)
