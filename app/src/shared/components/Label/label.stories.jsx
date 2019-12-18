// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, text, number } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'

import Label from '.'

const stories = storiesOf('Shared/Label', module)
    .addDecorator(styles({
        color: '#323232',
        padding: '1rem',
    }))
    .addDecorator(withKnobs)

stories.add('basic', () => (
    <Label>{text('Label', 'Label')}</Label>
))

stories.add('with position', () => (
    <div style={{
        width: '350px',
        height: '200px',
        border: '1px solid black',
        position: 'relative',
    }}
    >
        <Label topLeft>{text('First', 'First')}</Label>
        <Label bottomRight>{text('Second', 'Second')}</Label>
    </div>
))

stories.add('with badge & tag', () => (
    <div>
        <Label>
            <Label.Badge badge="members" value={number('Community members', 15)} />
        </Label>
        <br />
        <Label>
            <Label.Badge tag="community" />
        </Label>
    </div>
))
