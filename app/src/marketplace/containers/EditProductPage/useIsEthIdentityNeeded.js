// @flow

import { useMemo } from 'react'

import type { Address } from '$shared/flowtype/web3-types'
import useEthereumIdentities from '$shared/modules/integrationKey/hooks/useEthereumIdentities'
import { isEthereumAddress } from '$mp/utils/validate'
import useAccountAddress from '$shared/hooks/useAccountAddress'

export function useIsEthIdentityNeeded(owner?: Address) {
    const { isLinked, ethereumIdentities } = useEthereumIdentities()
    const accountAddress = useAccountAddress()

    return useMemo(() => {
        let isRequired = false
        let requiredAddress

        const isDeployed = owner && isEthereumAddress(owner)
        const accountLinked = !!accountAddress && isLinked(accountAddress)
        const ownerLinked = !!owner && isLinked(owner)

        const noIdentities = (!ethereumIdentities || ethereumIdentities.length <= 0)
        const walletLocked = (!isDeployed && !accountAddress)
        const noCurrentLink = (!isDeployed && !accountLinked)
        const noOwnerLink = (isDeployed && !ownerLinked)

        isRequired = !!(noIdentities || walletLocked || noCurrentLink || noOwnerLink)

        if (noOwnerLink) {
            requiredAddress = owner
        }

        return {
            isRequired,
            requiredAddress,
            walletLocked,
        }
    }, [
        owner,
        ethereumIdentities,
        isLinked,
        accountAddress,
    ])
}

export default useIsEthIdentityNeeded
