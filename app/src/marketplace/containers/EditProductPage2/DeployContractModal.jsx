// @flow

import React from 'react'
import useModal from '$shared/hooks/useModal'
import withWeb3 from '$shared/utils/withWeb3'

import DeployingCommunityDialog from '$mp/components/Modal/DeployingCommunityDialog'

const DeployingCommunityDialogWithWeb3 = withWeb3(DeployingCommunityDialog)

export default () => {
    const { api, isOpen, value } = useModal('deployContract')

    if (!isOpen) {
        return null
    }

    const { product } = value

    return (
        <DeployingCommunityDialogWithWeb3
            product={product}
            api={api}
            closeOnContinue={false}
            onClose={() => api.close(false)}
        />
    )
}
