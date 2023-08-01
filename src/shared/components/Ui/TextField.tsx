import React, {
    ChangeEventHandler,
    FocusEventHandler,
    ForwardedRef,
    forwardRef,
    InputHTMLAttributes,
    KeyboardEventHandler,
    TextareaHTMLAttributes,
    useEffect,
    useReducer,
    useRef,
    useState,
} from 'react'
import styled, { css } from 'styled-components'

interface CustomProps {
    commitSame?: boolean
    flushHistoryOnBlur?: boolean
    invalid?: boolean
    onCommit?: (value: string) => void
    revertOnEscape?: boolean
    selectAllOnFocus?: boolean
    value?: string
}

type Tag = 'input' | 'textarea' | undefined

type TagProps<T extends Tag = 'input'> = T extends undefined
    ? InputHTMLAttributes<HTMLInputElement>
    : T extends string
    ? T extends 'input'
        ? InputHTMLAttributes<HTMLInputElement>
        : TextareaHTMLAttributes<HTMLTextAreaElement>
    : never

type ElementProps<T extends Tag = 'input'> = T extends undefined
    ? HTMLInputElement
    : T extends string
    ? T extends 'input'
        ? HTMLInputElement
        : HTMLTextAreaElement
    : never

type Props<T extends Tag = 'input'> = {
    tag?: T
} & TagProps<T> &
    CustomProps

type TextFieldFC = <
    T extends Tag = 'input',
    R extends HTMLInputElement | HTMLTextAreaElement = ElementProps<T>,
>(
    props: Props<T>,
    ref?: ForwardedRef<R>,
) => JSX.Element

const BareTextField: TextFieldFC = <
    T extends Tag = 'input',
    R extends HTMLInputElement | HTMLTextAreaElement = ElementProps<T>,
>(
    {
        commitSame = false,
        flushHistoryOnBlur = false,
        onBlur: onBlurProp,
        onChange: onChangeProp,
        onCommit: onCommitProp,
        onFocus: onFocusProp,
        onKeyDown: onKeyDownProp,
        revertOnEscape = false,
        selectAllOnFocus = false,
        value: valueProp = '',
        ...props
    }: Props<T>,
    ref?: ForwardedRef<R>,
) => {
    const { tag = 'input', ...rest } = props

    const [value, setValue] = useState(valueProp)

    useEffect(() => {
        setValue(valueProp)
    }, [valueProp])

    const [cacheKey, invalidate] = useReducer((x) => x + 1, 0)

    const commitValueRef = useRef(valueProp)

    const revertToValueRef = useRef(valueProp)

    function onCommit(val: string) {
        if (!commitSame && commitValueRef.current === val) {
            return
        }

        commitValueRef.current = value

        revertToValueRef.current = value

        onCommitProp?.(value)
    }

    const onBlur: FocusEventHandler<R> = (e) => {
        if (flushHistoryOnBlur) {
            invalidate()
        }

        onCommit(value)

        const blur = onBlurProp as FocusEventHandler<R> | undefined

        blur?.(e)
    }

    const onChange: ChangeEventHandler<R> = (e) => {
        setValue(e.target.value)

        const change = onChangeProp as ChangeEventHandler<R> | undefined

        change?.(e)
    }

    const onFocus: FocusEventHandler<R> = (e) => {
        if (
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement
        ) {
            if (selectAllOnFocus) {
                e.target.select()
            }
        }

        revertToValueRef.current = value

        const focus = onFocusProp as FocusEventHandler<R> | undefined

        focus?.(e)
    }

    const onKeyDown: KeyboardEventHandler<R> = (e) => {
        if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
            onCommit(value)
        }

        if (revertOnEscape && e.key === 'Escape') {
            setValue(revertToValueRef.current)
        }

        const keyDown = onKeyDownProp as KeyboardEventHandler<R> | undefined

        keyDown?.(e)
    }

    if (tag === 'textarea') {
        const taRest = {
            ...rest,
            onBlur,
            onChange,
            onFocus,
            onKeyDown,
            value,
        } as TextareaHTMLAttributes<HTMLTextAreaElement>

        return (
            <textarea
                {...taRest}
                key={cacheKey}
                ref={ref as ForwardedRef<HTMLTextAreaElement>}
            />
        )
    }

    const inputRest = {
        ...rest,
        onBlur,
        onChange,
        onFocus,
        onKeyDown,
        value,
    } as InputHTMLAttributes<HTMLInputElement>

    return (
        <input
            {...inputRest}
            key={cacheKey}
            ref={ref as ForwardedRef<HTMLInputElement>}
        />
    )
}

const UnstyledTextField = forwardRef(BareTextField) as TextFieldFC

export const SpaciousTheme = {
    height: '64px',
}

const TextField = styled(UnstyledTextField)<{
    $dark?: boolean
    $invalid?: boolean
    $theme?: any
}>`
    background-color: ${({ $dark = false }) => ($dark ? '#fdfdfd' : '#ffffff')};
    border: 1px solid #efefef;
    border-radius: 4px;
    box-shadow: none;
    box-sizing: border-box;
    color: #323232;
    display: block;
    font-size: 1rem;
    height: 40px;
    line-height: 1;
    outline: none;
    padding: 0 1rem;
    width: 100%;

    ${({ $theme: { height } = {} }) =>
        typeof height !== 'undefined' &&
        css`
            height: ${height};
        `}

    ${({ $theme: { lineHeight } = {} }) =>
        typeof lineHeight !== 'undefined' &&
        css`
            line-height: ${lineHeight};
        `}

    /* Avoids weird browser bug where translucent elements with
     * same background colour and same opacity render with
     * different colours
     */
    backface-visibility: hidden;

    :disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: #efefef;
        border-color: #efefef;
        color: #32323280;
    }

    :not(:disabled):focus {
        border: 1px solid #0324ff;
        box-shadow: none;
        outline: none;
    }

    ::placeholder {
        color: #cdcdcd;
    }

    &[type='number'] {
        appearance: textfield; /* Hide spin buttons for Mozilla based browsers */
        display: inline-block;
        margin: 0;
        width: 100%;
    }

    /* Hide spin buttons for Webkit based browsers */
    &[type='number']::-webkit-inner-spin-button,
    &[type='number']::-webkit-outer-spin-button {
        appearance: none;
        margin: 0;
    }

    ${({ $invalid = false }) =>
        $invalid &&
        css`
            :not(:disabled),
            :not(:disabled):focus {
                border-color: #ff5c00;
            }
        `}
`

export default TextField
