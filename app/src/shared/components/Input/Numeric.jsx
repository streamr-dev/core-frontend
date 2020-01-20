// @flow

import React, { useCallback, useState, useRef } from 'react'
import styled from 'styled-components'
import SvgIcon from '$shared/components/SvgIcon'
import CoreText from '$shared/components/Input/CoreText'

type ButtonsProps = {
    onUpClick?: ?(SyntheticMouseEvent<EventTarget>) => void,
    onDownClick?: ?(SyntheticMouseEvent<EventTarget>) => void,
}

const UnstyledButtons = ({ onUpClick, onDownClick, ...props }: ButtonsProps) => (
    <div {...props}>
        <button type="button" onClick={onUpClick}>
            <SvgIcon name="caretUp" />
        </button>
        <button type="button" onClick={onDownClick}>
            <SvgIcon name="caretDown" />
        </button>
    </div>
)

const Buttons = styled(UnstyledButtons)`
    display: inline-grid;
    grid-template-rows: 50% 50%;
    position: absolute;
    right: 24px;
    margin: 1px; /* We don't want to overlap with text field's border */

    button {
        width: 24px;
        height: 19px;
        background-color: transparent;
        border: 0;
        border-left: 1px solid #EFEFEF;
        border-radius: 0;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
    }

    button,
    button:active,
    button:focus,
    button:hover,
    button:visited {
        outline: none;
    }

    button:active {
        background-color: #EFEFEF;
    }

    button + button {
        border-top: 1px solid #EFEFEF;
    }

    svg {
        display: flex;
        align-self: center;
        color: #323232;
        width: 8px;
        height: 8px;
    }
`

type Props = {
    value?: string,
    min?: number,
    max?: number,
    step?: number,
    hideButtons?: boolean,
    onChange?: (SyntheticInputEvent<EventTarget>) => void,
}

const Numeric = ({
    value,
    min,
    max,
    step,
    hideButtons = false,
    onChange: onChangeProp,
    ...props
}: Props) => {
    const [internalValue, setInternalValue] = useState(value)
    const inputRef = useRef()

    const onChange = useCallback((event: SyntheticInputEvent<EventTarget>) => {
        setInternalValue(event.target.value)

        if (onChangeProp) {
            onChangeProp(event)
        }
    }, [onChangeProp])

    const addValue = useCallback((event: SyntheticInputEvent<EventTarget>, val) => {
        let parsedValue = Number.parseFloat(internalValue != null ? internalValue : '')
        let parsedStep = Number.parseFloat(val.toString())

        if (Number.isNaN(parsedValue)) {
            parsedValue = 0
        }
        if (Number.isNaN(parsedStep)) {
            parsedStep = 1
        }

        let newValue = parsedValue + parsedStep

        if (min != null && newValue < min) {
            newValue = min
        }
        if (max != null && newValue > max) {
            newValue = max
        }

        if (inputRef.current) {
            inputRef.current.focus()
        }

        // eslint-disable-next-line no-param-reassign
        event.target.value = newValue.toString()

        onChange(event)
    }, [min, max, internalValue, onChange])

    const onIncrease = useCallback((event: SyntheticInputEvent<EventTarget>) => {
        event.preventDefault()
        addValue(event, step != null ? step : 1)
    }, [addValue, step])

    const onDecrease = useCallback((event: SyntheticInputEvent<EventTarget>) => {
        event.preventDefault()
        addValue(event, -(step != null ? step : 1))
    }, [addValue, step])

    return (
        <div
            style={{
                position: 'relative',
            }}
        >
            <CoreText
                {...props}
                type="number"
                min={min}
                max={max}
                step={step}
                value={internalValue != null ? internalValue : ''}
                onChange={onChange}
                ref={inputRef}
            />
            {!hideButtons && (
                <Buttons
                    onUpClick={onIncrease}
                    onDownClick={onDecrease}
                />
            )}
        </div>
    )
}

export default Numeric
