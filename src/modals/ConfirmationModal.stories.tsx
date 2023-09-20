import React from 'react'
import { action } from '@storybook/addon-actions'
import { Container } from 'toasterhea'
import { Meta } from '@storybook/react'
import { COLORS } from '~/shared/utils/styled'
import { Layer } from '~/utils/Layer'
import { useConfirmationModal } from '~/hooks/useConfirmationModal'

export const Default = () => {
    const confirmationModal = useConfirmationModal()
    return (
        <div>
            <button
                onClick={async () => {
                    const result = await confirmationModal({
                        title: 'Are you sure?',
                        description:
                            'Proceeding forward might cause a vulcanic erruption!. It might destroy life on earth as we know it!',
                        proceedLabel: 'Proceed anyway',
                        cancelLabel: 'Cancel',
                    })
                    action('confirmation result')(result)
                }}
            >
                open modal
            </button>
        </div>
    )
}

const meta: Meta<typeof Default> = {
    title: 'Shared/ConfirmationModal',
    component: Default,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        padding: '40px',
                        maxWidth: '600px',
                        backgroundColor: 'lightgrey',
                        color: COLORS.primary,
                    }}
                >
                    <Story />
                    <Container id={Layer.Modal} />
                </div>
            )
        },
    ],
}

export default meta
