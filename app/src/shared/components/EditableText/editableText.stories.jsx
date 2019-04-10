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

stories.add('default', () => (
    <Prop initialValue={false}>
        {(editing, setEditing) => (
            <Prop initialValue="Double-click to edit…">
                {(text, setText) => (
                    <EditableText
                        editing={editing}
                        onChange={setText}
                        setEditing={setEditing}
                    >
                        {text}
                    </EditableText>
                )}
            </Prop>
        )}
    </Prop>
))
