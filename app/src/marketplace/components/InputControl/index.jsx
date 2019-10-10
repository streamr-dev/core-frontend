// @flow

import { type Node, useState, useCallback, useEffect } from 'react'

export type InputProps = {
    onFocusChange: (SyntheticEvent<EventTarget>) => void,
    value: any,
    hasFocus: boolean,
    hasError: boolean,
    error: ?string,
    className?: string,
}

export type FormControlProps = {
    error?: string,
    processing?: boolean,
    type?: string,
    value?: any,
}

type Props = FormControlProps & {
    children?: (InputProps) => Node,
}

const InputControl = (props: Props) => {
    const {
        value,
        children,
        error,
        processing,
        ...rest
    } = props
    const [hasFocus, setHasFocus] = useState(false)
    const [lastKnownError, setLastKnownError] = useState(error)

    useEffect(() => {
        setLastKnownError((prevError) => {
            if (error && prevError !== error) {
                return error
            }

            return prevError
        })
    }, [error])

    const onFocusChange = useCallback(({ type }: SyntheticEvent<EventTarget>) => {
        setHasFocus(type === 'focus')
    }, [setHasFocus])

    if (!children) {
        return null
    }

    return children({
        ...rest,
        onFocusChange,
        hasFocus,
        value,
        hasError: !processing && !!error,
        error: lastKnownError,
    })
}

export default InputControl
