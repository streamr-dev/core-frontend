// @flow

import React from 'react'

import { type PublishMode, publishModes } from '$mp/containers/EditProductPage/usePublish'
import type { ProductId } from '$mp/flowtype/product-types'

import PublishComplete from './PublishComplete'
import UnpublishComplete from './UnpublishComplete'

export type BaseProps = {
    onClose: () => void,
}

export type Props = BaseProps & {
    onContinue: () => void,
    publishMode: PublishMode,
    productId: ProductId,
}

export default ({ publishMode, onClose, onContinue, productId }: Props) => {
    if (publishMode === publishModes.UNPUBLISH) {
        return (
            <UnpublishComplete
                onClose={onClose}
            />
        )
    }

    return (
        <PublishComplete
            publishMode={publishMode}
            onContinue={onContinue}
            onClose={onClose}
            productId={productId}
        />
    )
}
