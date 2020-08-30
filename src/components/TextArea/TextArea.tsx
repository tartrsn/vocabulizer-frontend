import React, {useState} from "react"
import "./TextArea.css"
import BEM from "../../utils/BEM"
const b = BEM("TextArea")

type Props = {
    children: (value: string) => React.ReactNode
    value : string
}

const TextArea: React.FunctionComponent<Props> = (props) => {
    const {children} = props
    const [value, setValue] = useState(props.value || "")

    return (
        <div className={b()}>
            <div className={b("input-wrapper")}>
                <textarea onChange={ (ev) => setValue(ev.currentTarget.value)} className={b("input")} value={value}/>
                <div className={b("input-highlighter")}>
                    {children(value)}
                </div>
            </div>
        </div>
    )
}

export default TextArea
