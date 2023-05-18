import React from 'react'
import {Meta} from "@storybook/react"
import UseState from '$shared/components/UseState'
import TextControl from '.'

export const Enhanced = () => (
    <UseState initialValue="Lorem ipsum.">
        {(value, setValue) => (
            <TextControl
                flushHistoryOnBlur
                immediateCommit={false}
                commitEmpty={false}
                revertOnEsc
                selectAllOnFocus
                onCommit={setValue}
                value={value}
            />
        )}
    </UseState>
)

Enhanced.story = {
    name: 'enhanced',
}

const meta: Meta<typeof Enhanced> = {
    title: 'Shared/TextControl',
    component: Enhanced,
    decorators: [(Story) => {
        return <div style={{
            color: '#323232',
        }}>
            <Story/>
        </div>
    }]
}

export default meta

export const RevertOnEscape = () => (
    <UseState initialValue="Lorem ipsum.">
        {(value, setValue) => (
            <TextControl revertOnEsc onCommit={setValue} value={value} />
        )}
    </UseState>
)

RevertOnEscape.story = {
    name: 'revert on Escape',
}

export const RequireValue = () => (
    <UseState initialValue="Lorem ipsum.">
        {(value, setValue) => (
            <TextControl commitEmpty={false} onCommit={setValue} value={value} />
        )}
    </UseState>
)

RequireValue.story = {
    name: 'require value',
}

export const CommitOnEnter = () => (
    <UseState initialValue="Lorem ipsum.">
        {(value, setValue) => (
            <TextControl immediateCommit={false} onCommit={setValue} value={value} />
        )}
    </UseState>
)

CommitOnEnter.story = {
    name: 'commit on Enter',
}

export const SelectAllOnFocus = () => (
    <UseState initialValue="Lorem ipsum.">
        {(value, setValue) => (
            <TextControl selectAllOnFocus onCommit={setValue} value={value} />
        )}
    </UseState>
)

SelectAllOnFocus.story = {
    name: 'select all on focus',
}

export const PreventUndoAfterBlur = () => (
    <UseState initialValue="Lorem ipsum.">
        {(value, setValue) => (
            <TextControl flushHistoryOnBlur onCommit={setValue} value={value} />
        )}
    </UseState>
)

PreventUndoAfterBlur.story = {
    name: 'prevent undo after blur',
}

export const UpdatePropOnCommit = () => (
    <UseState initialValue="0">
        {(value, setValue) => (
            <TextControl
                immediateCommit={false}
                onCommit={(v) => {
                    setValue(Number(v) + 1)
                }}
                value={value}
            />
        )}
    </UseState>
)

UpdatePropOnCommit.story = {
    name: 'update prop on commit',
}

export const Textarea = () => (
    <UseState initialValue="Lorem ipsum.">
        {(value, setValue) => (
            <TextControl tag="textarea" value={value} onCommit={setValue} />
        )}
    </UseState>
)

Textarea.story = {
    name: 'textarea',
}
