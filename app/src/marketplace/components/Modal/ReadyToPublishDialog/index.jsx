// @flow

import React from 'react'

import { type PublishMode, publishModes } from '$mp/containers/EditProductPage/usePublish'
import ReadyToPublish from './ReadyToPublish'
import ReadyToUnpublish from './ReadyToUnpublish'

export type BaseProps = {
    onCancel: () => void,
    onContinue: () => void,
    disabled?: boolean,
}

export type Props = BaseProps & {
    publishMode: PublishMode,
}

export default ({ publishMode, onCancel, onContinue, disabled }: Props) => {
    if (publishMode === publishModes.UNPUBLISH) {
        return (
            <ReadyToUnpublish
                onContinue={onContinue}
                onCancel={onCancel}
                disabled={disabled}
            />
        )
    }

    return (
        <ReadyToPublish
            publishMode={publishMode}
            onContinue={onContinue}
            onCancel={onCancel}
            disabled={disabled}
        />
    )
}
