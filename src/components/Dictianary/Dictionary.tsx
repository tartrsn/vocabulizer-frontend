import React from 'react'
import { DictionaryItem } from '../../utils/getDictionaryFromSrc'
import { Word } from '../Word/Word'
import './Dictionary.css'
import BEM from '../../utils/BEM'
import { append, contains, without } from 'ramda'

const b = BEM('Dictionary')

type Props = {
  selectedWords: DictionaryItem[]
  dictionary: DictionaryItem[]
  onSelectWords?: (words: DictionaryItem[]) => void
}

export const Dictionary: React.FunctionComponent<Props> = ({ dictionary, selectedWords, onSelectWords }) => (
  <div className={b()}>
    {dictionary.map((word) => (
      <Word
        selected={contains(word, selectedWords)}
        key={word.dictionaryWord}
        word={word}
        onSelect={(word) => {
          if (contains(word, selectedWords)) {
            return onSelectWords?.(without([word], selectedWords))
          } else {
            return onSelectWords?.(append(word, selectedWords))
          }
        }}
      />
    ))}
  </div>
)
