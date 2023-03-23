import { Node } from 'react'
import { useState } from 'react'
type Props = {
    initialValue?: any
    children: (arg0: any, arg1: (arg0: any) => void) => Node
}

const UseState = ({ children, initialValue }: Props) => {
    const [value, setValue] = useState(initialValue)
    return children(value, setValue)
}

export default UseState
