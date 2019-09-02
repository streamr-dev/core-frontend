// @flow

import React from 'react'
import useModal from '$shared/hooks/useModal'

import DeployCommunityDialog from '$mp/components/Modal/DeployCommunityDialog'

export default () => {
    const { api, isOpen } = useModal('deployCommunity')

    if (!isOpen) {
        return null
    }

    return (
        <DeployCommunityDialog
            onClose={() => api.close(false)}
        />
    )
}
