import { assoc, filter, flatten, includes, isEmpty, map, mapObjIndexed, pipe, propEq, reduce, sort, when } from 'ramda'
import React, { useMemo, useState } from 'react'
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

const sample = `I spent the first six months of the pandemic sure that help for mothers was on its way. Bills would be passed, systems would be reworked. Workplaces would shift to include caretaking within their cultures. A year of the country “staying home” would validate the work of stay-at-home mothers. As the fall brought more remote learning, we’d reconfigure school standards to keep children safe from virtual truancy and failing grades given over Zoom in the name of academic rigor. We would listen to women like Natalie Brown, mother of two and a PhD candidate, when she says we’d “shift our focus and policies to helping families survive this time in ways that work for them.”

When it came to the 2020–2021 school year, maybe that meant we’d take a cue from Bolivia and suspend academics. We’d figure this disease out and then we could start again, on an even footing, a year later. Maybe it meant remote school accompanied by a temporary measure that untied education funding from enrollment. If schools were allowed to keep their enrollment funding from the previous year, a working mother who pulled her kid from their kindergarten class because she couldn’t supervise their remote learning wouldn’t be culpable for impoverishing her neighborhood school. Maybe it meant a government check every month until the pandemic was over, so that women could pay a living wage to childcare workers to supervise their kids’ living and learning. Whatever the shift, we would have had to think outside the demands of our standard systems. As Brown notes, “This pandemic has underscored how institutions can’t just operate to promote their own agendas while ignoring their roles in the community ecosystem. Our university relies on public schools which relies on daycare providers and parents, etc. We need holistic solutions.”

Instead of holistic solutions, we have a funding and community crisis. My family’s school district is remote through at least October. People are taking their children out of school at a concerning rate. Yesterday, the principal of our elementary school took to the neighborhood Facebook page to tell parents how much money our school was losing each time a child withdrew. I feel for him. He is an excellent educator dedicated to equity. He’s working within a system with broken funding and bitter, often racist, divides. The comments on the post were mostly supportive, many in my neighborhood talked about the importance of maintaining our community through enrollment, it was “the right thing to do.”

As a parent who is keeping one daughter in remote public school and has unenrolled another with dyslexia, I stayed quiet. Remote learning isn’t good for kids, but I can offer my oldest to the funding gods. She’ll be fine. My child with dyslexia needs additional support. Remote learning in the spring marked her up in ways I couldn’t ask her to face again. She’d always moved uncertainly through a world with processes running counter to her brain’s wiring. Remote learning, with its links, forms, and online submissions was unintelligible to her. It was too remote. She couldn’t touch it. She’d been cut off. Her insecurity turned into self-loathing. I don’t know if my decision to keep one child in remote public school while taking another child out will be just enough to keep me in my community, or just enough to exile me from it.

Leniency on work schedules and compensation is a request every working mother has made since she brought her first child home from the hospital.

When our school district sent out a statement about pods and unenrollment, they said the already present evils of segregation and inequity were worsening in the pandemic. They’re right. One of their tips to help parents keep kids enrolled and remotely present for daily attendance was: “Ask your employer to provide leniency on work schedules and compensation during periods of remote learning.” Leniency on work schedules and compensation is a request every working mother has made since she brought her first child home from the hospital. Sometimes she’s just told no, many times she’s fired over it. It’s a laughable tip, but what is the district supposed to do? When every broken institution depends on the unpaid labor of caretakers and those caretakers are finally broken themselves, all we’re left with are statements and suggestions signifying nothing.

According to a recent survey by Morning Consult, four in five parents of remote learning kids say they have “no in-person help educating and caring for them, whether from relatives, neighbors, nannies, or tutors.” When a study like this says parents, it mostly means “mostly mothers.” The bulk of pandemic hardship is falling on the mothers; 54% of women in the survey said they will be the ones handling their children’s weekday education. Many working moms who are deeply engaged in their communities are having to choose between funding the school with enrollment or keeping their jobs.

When those mothers choose enrollment and out-of-the-home work, and if they’re unable to ensure their child regularly attends remote classes, they are endangered through the anti-truancy alliance between schools and the state. In “high-poverty, predominantly Black and Latino school districts” mothers are being hauled into truancy court because their elementary children didn’t attend enough Zoom classes. If mothers unenroll their children because they cannot supervise full-day remote learning and are concerned about the repercussions, they’re told they’ve violated a sacred social contract. Mothers who form pods to get childcare for their kids while they remote learn are privileged pariahs. Single working mothers who do not have the network or money to form a pod will be reported to the authorities when a neighbor realizes their seven-year-old is home alone every day while her mom earns money for food and rent. Stay-at-home mothers are not allowed to feel anything but grateful to be of service to their kids and their community.

I finally understand that help is not coming. With kids home from school but still burdened with scholastic progress, many working moms will cut back when they were just ready to spring forward. They’re going to lose years of progress when it matters most to their careers. In the decades to come, those women will be missing from the leadership positions they would have occupied if we’d decided they mattered enough to help them. Their children will watch them fold into themselves. Stay-at-home moms who depend on school hours to perform household labor, go back to school themselves, and do so much of the daytime community work that keeps communities afloat will find themselves collapsing. The crying won’t stay in the kitchen. We can’t keep holding our homes and communities up if we’ve fallen in ourselves.

If we can’t fix our culture, can we at least be honest about what it values?

This financial and social recession will continue to hit mothers — working in and outside of the home — with sharp, leveling blows. As always, our inability to think outside of established systems is going to hurt the vulnerable the most. Some of the effects won’t be seen in the labor force withdrawal or in the school district’s ledgers. According to a study on mental health during Covid, conducted by the Centers for Disease Control and Prevention, over 25% of Americans between the ages of 18 and 24 seriously considered suicide in the last 30 days; 16% of those ages 25 to 44 considered it. In America, the average age of a first-time mother is 26. I was 24 when I had my first baby. How many mothers right now are looking out the window for a little too long, gripping their steering wheels a little too tight, giving up a little too much?

Whether we labor in our homes or outside of them, every mother will wake up every morning remembering that when it comes to their needs, America just can’t really be bothered. Can’t be bothered to provide financial help. Can’t be bothered to find a new way. Can’t be bothered to reach across the kitchen table and hold the hand of the mother who can’t lift her head from its crumb-strewn surface. Simply can’t be bothered. I guess I always knew this about America but now, after this pandemic, I understand it.`
// const sample = faker.lorem.paragraphs(1).split('\n \r').join('\n\n')

const App: React.FunctionComponent<{}> = () => {
  const [src, setSrc] = useState<string>(sample)
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
        map((word: any) => ({ ...word, entriesInSrc: entriesMap[word.dictionaryWord], known: false }))(words)
      )
    },
    500,
    [src],
  )

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

  const markAsKnown = async ({dictionaryWord, partOfSpeechTag}: DictionaryItem, source?: string) => {
    await fetch('/add-known-word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dictionaryWord, partOfSpeechTag, source }),
    });

    setDictionary(
      map(
        when(
          propEq('dictionaryWord', dictionaryWord),
          assoc('known', true)
        )
      )(dictionary) as unknown as DictionaryItem[]
    )
  }

  return (
    <div className={b()}>
      <TextArea value={src} onChange={setSrc}>
        {(value) => <Highlighter text={value} highlighters={highlighters} />}
      </TextArea>
      {dictionary && (
        <Dictionary selectedWords={selectedWords} dictionary={dictionary} onSelectWords={setSelectedWords} onMarkAsKnown={markAsKnown} />
      )}
    </div>
  )
}

export default React.memo(App)
