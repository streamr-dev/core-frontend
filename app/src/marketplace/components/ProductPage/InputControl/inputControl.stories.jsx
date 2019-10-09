// @flow

import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'

import InputControl from '.'

const stories =
    storiesOf('Marketplace/ProductPage/InputControl', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '5rem',
            background: '#F8F8F8',
        }))
        .addDecorator(withKnobs)

type ErrorToggleProps = {
    checked: boolean,
    onChange: (boolean) => void,
}

const ErrorToggle = ({ checked, onChange: onChangeProp }: ErrorToggleProps) => {
    const onChange = (e: SyntheticInputEvent<EventTarget>) => {
        onChangeProp(e.target.checked)
    }

    return (
        <label>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
            /> Show error
        </label>
    )
}

const BasicController = () => {
    const [showError, setShowError] = useState(false)

    return (
        <InputControl error={showError ? 'error message' : undefined}>
            {({
                hasFocus,
                onFocusChange,
                hasError,
                error,
                ...rest
            }) => (
                <div>
                    <ErrorToggle checked={showError} onChange={setShowError} />
                    <br /><br />
                    <input
                        type="text"
                        onBlur={onFocusChange}
                        onFocus={onFocusChange}
                        {...rest}
                    />
                    <br /><br />
                    Focus: {hasFocus ? 'focused' : 'not focused'}
                    <br />
                    Error: {!!hasError && error}
                </div>
            )}
        </InputControl>
    )
}

stories.add('basic', () => (
    <BasicController />
))

const ValueController = () => {
    const [showError, setShowError] = useState(false)
    const [textValue, setTextValue] = useState(undefined)

    const onChange = (e: SyntheticInputEvent<EventTarget>) => {
        setTextValue(e.target.value)
    }

    return (
        <InputControl error={showError ? 'error message' : undefined}>
            {({
                hasFocus,
                onFocusChange,
                hasError,
                error,
                ...rest
            }) => (
                <div>
                    <ErrorToggle checked={showError} onChange={setShowError} />
                    <br /><br />
                    <input
                        type="text"
                        onBlur={onFocusChange}
                        onFocus={onFocusChange}
                        value={textValue}
                        onChange={onChange}
                        {...rest}
                    />
                    <br /><br />
                    Focus: {hasFocus ? 'focused' : 'not focused'}
                    <br />
                    Error: {!!hasError && error}
                </div>
            )}
        </InputControl>
    )
}

stories.add('controlled value', () => (
    <ValueController />
))
