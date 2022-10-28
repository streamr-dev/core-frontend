import React from 'react'
import type { PublishMode } from '$mp/containers/EditProductPage/usePublish'
import { publishModes } from '$mp/containers/EditProductPage/usePublish'
import ReadyToPublish from './ReadyToPublish'
import ReadyToUnpublish from './ReadyToUnpublish'

export type BaseProps = {
    onCancel: () => void
    onContinue: () => void
    disabled?: boolean
}

export type Props = BaseProps & {
    publishMode: PublishMode
    nativeTokenName: string
}

const ReadyToPublishDialogWrap = ({ publishMode, onCancel, onContinue, disabled, nativeTokenName }: Props) => {
    if (publishMode === publishModes.UNPUBLISH) {
        return <ReadyToUnpublish onContinue={onContinue} onCancel={onCancel} disabled={disabled} />
    }

    return (
        <ReadyToPublish
            publishMode={publishMode}
            onContinue={onContinue}
            onCancel={onCancel}
            disabled={disabled}
            nativeTokenName={nativeTokenName}
        />
    )
}

export default ReadyToPublishDialogWrap
