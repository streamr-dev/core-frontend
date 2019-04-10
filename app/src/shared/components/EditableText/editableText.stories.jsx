// $flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import UseState from '../UseState'
import EditableText from '.'

const stories =
    storiesOf('Shared/EditableText', module)
        .addDecorator(styles({
            color: '#323232',
            fontSize: '50px',
        }))

stories.add('default', () => (
    <UseState initialValue={false}>
        {(editing, setEditing) => (
            <UseState initialValue="Double-click to edit…">
                {(text, setText) => (
                    <EditableText
                        editing={editing}
                        onChange={setText}
                        setEditing={setEditing}
                    >
                        {text}
                    </EditableText>
                )}
            </UseState>
        )}
    </UseState>
))
