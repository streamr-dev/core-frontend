// $flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import Prop from '../Prop'
import EditableText from '.'

const stories =
    storiesOf('Shared/EditableText', module)
        .addDecorator(styles({
            color: '#323232',
            fontSize: '50px',
        }))

// HERE

stories.add('default', () => (
    <Prop initialValue="Double-click to edit…">
        {(text, setText) => (
            <EditableText onChange={setText}>
                {text}
            </EditableText>
        )}
    </Prop>
))
