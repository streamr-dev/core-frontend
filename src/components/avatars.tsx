import React from 'react'
import { HubAvatar, HubImageAvatar } from '~/shared/components/AvatarImage'

export function OperatorAvatar({
    operatorId,
    imageUrl,
}: {
    operatorId: string
    imageUrl?: string
}) {
    if (imageUrl) {
        return (
            <HubImageAvatar
                src={imageUrl}
                alt=""
                placeholder={<HubAvatar id={operatorId} />}
            />
        )
    }

    return <HubAvatar id={operatorId} />
}
