import React from 'react'
import { PublishMode } from '$mp/containers/EditProductPage/usePendingChanges'
import type { ProductId } from '$mp/types/product-types'
import PublishComplete from './PublishComplete'
import UnpublishComplete from './UnpublishComplete'

export type BaseProps = {
    onClose: () => void
}

export type Props = BaseProps & {
    onContinue: () => void
    publishMode: PublishMode
    productId: ProductId
}

const PublishCompleteWrap = ({ publishMode, onClose, onContinue, productId }: Props) => {
    if (publishMode === PublishMode.UNPUBLISH) {
        return <UnpublishComplete onClose={onClose} />
    }

    return <PublishComplete publishMode={publishMode} onContinue={onContinue} onClose={onClose} productId={productId} />
}

export default PublishCompleteWrap
