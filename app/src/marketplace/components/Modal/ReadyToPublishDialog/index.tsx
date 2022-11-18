import React from 'react'
import { PublishMode } from '$mp/containers/EditProductPage/usePendingChanges'
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
    if (publishMode === PublishMode.UNPUBLISH) {
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
