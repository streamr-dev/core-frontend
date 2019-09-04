// @flow

import React from 'react'
import useModal from '$shared/hooks/useModal'

import GuidedDeployCommunityDialog from '$mp/components/Modal/GuidedDeployCommunityDialog'

export default () => {
    const { api, isOpen } = useModal('deployCommunity')

    if (!isOpen) {
        return null
    }

    return (
        <GuidedDeployCommunityDialog
            onContinue={() => {}}
            onClose={() => api.close(false)}
        />
    )
}
