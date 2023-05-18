import React from 'react'
import {Meta} from "@storybook/react"
import UseState from '../UseState'
import EditableText from '.'

export const Default = () => (
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
)

Default.story = {
    name: 'default',
}

const meta: Meta<typeof Default> = {
    title: 'Shared/EditableText',
    component: Default,
    decorators: [(Story) => {
        return <div style={{
            color: '#323232',
            fontSize: '32px',
        }}>
            <Story/>
        </div>
    }]
}

export default meta

export const Zero = () => (
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
)

Zero.story = {
    name: 'zero',
}

export const Placeholder = () => (
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
)

Placeholder.story = {
    name: 'placeholder',
}

export const ShortPlaceholder = () => (
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
)

ShortPlaceholder.story = {
    name: 'short placeholder',
}

export const EditOnFocus = () => (
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
)

EditOnFocus.story = {
    name: 'edit on focus',
}
