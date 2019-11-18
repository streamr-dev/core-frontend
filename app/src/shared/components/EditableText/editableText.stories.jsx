// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import UseState from '../UseState'
import EditableText from '.'

const stories =
    storiesOf('Shared/EditableText', module)
        .addDecorator(styles({
            color: '#323232',
            fontSize: '32px',
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

stories.add('zero', () => (
    <UseState initialValue={false}>
        {(editing, setEditing) => (
            <UseState initialValue={0}>
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

stories.add('placeholder', () => (
    <UseState initialValue={false}>
        {(editing, setEditing) => (
            <UseState initialValue="">
                {(text, setText) => (
                    <EditableText
                        placeholder="Placeholder Text"
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

stories.add('short placeholder', () => (
    <UseState initialValue={false}>
        {(editing, setEditing) => (
            <UseState initialValue="">
                {(text, setText) => (
                    <EditableText
                        placeholder="M"
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

stories.add('edit on focus', () => (
    <div>
        <button
            type="text"
            style={{
                fontSize: '16px',
                padding: '1em',
            }}
        >
            Helping button. Focus it and press Tab.
        </button>
        <UseState initialValue={false}>
            {(editing, setEditing) => (
                <UseState initialValue="Focus to edit…">
                    {(text, setText) => (
                        <EditableText
                            editOnFocus
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
    </div>
))
