import React, { useState, useEffect } from 'react'
import './TextArea.css'
import BEM from '../../utils/BEM'
const b = BEM('TextArea')

type Props = {
  onChange?: (vallue: string) => void
  children: (value: string) => React.ReactNode
  value: string
}

const TextArea: React.FunctionComponent<Props> = (props) => {
  const { children, onChange } = props
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(props.value)
  }, [props.value]);

  useEffect(() => {
    onChange?.(value)
  }, [value, onChange])

  return (
    <div className={b()}>
      <textarea onInput={(ev) => setValue(ev.currentTarget.value)} className={b('input')} defaultValue={value} />
      <div className={b('input-highlighter')}>{children(value)}</div>
    </div>
  )
}

export default TextArea
