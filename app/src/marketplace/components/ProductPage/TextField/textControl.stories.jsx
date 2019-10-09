// @flow

import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'

import TextField from '.'

const stories =
    storiesOf('Marketplace/ProductPage/TextField', module)
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
        <div>
            <ErrorToggle checked={showError} onChange={setShowError} />
            <TextField
                placeholder="Add some text"
                error={showError ? 'error message' : undefined}
            />
        </div>
    )
}

stories.add('basic', () => (
    <BasicController />
))
