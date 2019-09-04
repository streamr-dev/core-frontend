// @flow

import React from 'react'
import useModal from '$shared/hooks/useModal'

import GuidedDeployCommunityDialog from '$mp/components/Modal/GuidedDeployCommunityDialog'

export default () => {
    const { api, isOpen, value } = useModal('deployCommunity')

    if (!isOpen) {
        return null
    }

    const { product } = value

    return (
        <GuidedDeployCommunityDialog
            product={product}
            onContinue={() => {}}
            onClose={() => api.close(false)}
        />
    )
}
