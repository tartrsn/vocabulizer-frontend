import { append, flatten, groupBy, pipe, prop, reduce, sort, toLower, toPairs, unfold } from 'ramda'
import { Range } from './inrervals'

export type DictionaryItem = {
  dictionaryWord: string
  partOfSpeechTag: string
  entriesInSrc: Range[]
}

export const getDictionaryFromSrc = (src: string): DictionaryItem[] =>
  pipe(
    unfold<[string, number], DictionaryItem>(([src, index]) => {
      const testStr = src.slice(index)
      const result = testStr.match(/[\w’]+/)

      if (!result) return false

      return [
        {
          dictionaryWord: toLower(result?.[0]),
          partOfSpeechTag: 'NOUN',
          entriesInSrc: [
            {
              start: index + (result.index ?? 0),
              end: index + (result.index ?? 0) + result?.[0].length,
            },
          ],
        },
        [src, index + result[0].length + (result?.index ?? 0)],
      ]
    }),
    groupBy(({ dictionaryWord }) => dictionaryWord),
    toPairs,
    reduce<[string, DictionaryItem[]], DictionaryItem[]>(
      (result, [word, values]) =>
        append(
          {
            dictionaryWord: word,
            partOfSpeechTag: values[0].partOfSpeechTag ?? '--',
            entriesInSrc: flatten(values.map(prop('entriesInSrc'))),
          },
          result,
        ),
      [],
    ),
    sort((a, b) => b.entriesInSrc.length - a.entriesInSrc.length),
  )([src, 0]) as DictionaryItem[]
