import { append, assoc, filter, flatten, includes, isEmpty, map, mapObjIndexed, pipe, propEq, reduce, sort, when, without } from 'ramda'
import React, { useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'react-use'
// import faker from 'faker'
import BEM from '../../utils/BEM'
import { DictionaryItem } from '../../utils/getDictionaryFromSrc'
import { mergeIntervals, Range } from '../../utils/inrervals'
import { Dictionary } from '../Dictianary/Dictionary'
import { Highlighter } from '../Highlighter/Highlighter'
import TextArea from '../TextArea/TextArea'
import './App.css'


const b = BEM('App')

const App: React.FunctionComponent<{}> = () => {
  const [src, setSrc] = useState<string>('')
  const [dictionary, setDictionary] = useState<DictionaryItem[]>([])

  useDebounce(
    async () => {
      const response = await fetch('/get-dictionary-from-src', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ src }),
      })

      const { data: { words }, meta: { entries } } = await response.json()

      const entriesMap: Record<string, Range[]> = pipe(
        reduce((acc, entry: any) => ({ ...acc, [entry.word]: entry.entries }), {}),
        mapObjIndexed(flatten),
      )(entries);

      setDictionary(
        map((word: any) => ({ known: false, ...word, entriesInSrc: entriesMap[word.dictionaryWord] }))(words)
      )
    },
    500,
    [src],
  )

  useEffect(() => {
    fetch('/text-to-read')
      .then(resp => resp.json())
      .then(({ src }) => setSrc(src))
  }, []);

  const [selectedWords, setSelectedWords] = useState<string[]>([])

  const highlighters = useMemo<Range[]>(() => {
    if (isEmpty(selectedWords)) return []

    return pipe(
      (words: string[]): DictionaryItem[] =>
        filter((dictionaryItem) => !dictionaryItem.known && includes(dictionaryItem.dictionaryWord, words), dictionary),

      map<DictionaryItem, Range[]>(({ entriesInSrc }) => entriesInSrc),
      flatten,
      sort<Range>((a, b) => a.start - b.start),
      mergeIntervals,
    )(selectedWords)
  }, [selectedWords, dictionary])

  const markAsKnown = async ({ dictionaryWord, partOfSpeechTag }: DictionaryItem, source?: string) => {
    setDictionary(
      map(
        when(
          propEq('dictionaryWord', dictionaryWord),
          assoc('known', true)
        )
      )(dictionary) as unknown as DictionaryItem[]
    );

    await fetch('/add-known-word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dictionaryWord, partOfSpeechTag, source }),
    });
  }

  const selectWord = async (word: DictionaryItem, selected: boolean) => {
    const words = selected ? without([word.dictionaryWord], selectedWords) : append(word.dictionaryWord, selectedWords);
    setSelectedWords(words);

    await fetch('/add-to-memorise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...word, highlighted: selected }),
    });
  }

  return (
    <div className={b()}>
      <TextArea value={src} onChange={setSrc}>
        {(value) => <Highlighter text={value} highlighters={highlighters} />}
      </TextArea>
      {dictionary && (
        <Dictionary selectedWords={selectedWords} dictionary={dictionary} onSelectWord={selectWord} onMarkAsKnown={markAsKnown} />
      )}
    </div>
  )
}

export default React.memo(App)
