import { Meta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import React from 'react'
import Dialog from '$app/src/shared/components/Dialog'

export const Basic = () => {
    const actions: any = {}

    actions.cancel = {
        title: 'Cancel',
        kind: 'link',
        onClick: action('onDismiss'),
    }

    const waitingForSave = false
    actions.ok = {
        title: waitingForSave ? 'Saving....' : 'Save',
        kind: 'primary',
        onClick: action('onSave'),
        disabled: waitingForSave,
        spinner: waitingForSave,
    }

    return (
        <Dialog
            showCloseIcon={true}
            waiting={false}
            title={'Dialog Title'}
            actions={actions}
        >
            Content goes here...
        </Dialog>
    )
}

Basic.story = {
    name: 'basic',
}

const meta: Meta<typeof Basic> = {
    title: 'Shared/Dialog',
    component: Basic,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        color: '#323232',
                        padding: '15px',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}
export default meta
