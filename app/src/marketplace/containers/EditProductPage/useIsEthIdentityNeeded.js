// @flow

import { useMemo } from 'react'

import useDataUnion from '$mp/containers/ProductController/useDataUnion'
import useEthereumIdentities from '$shared/modules/integrationKey/hooks/useEthereumIdentities'
import { isDataUnionProduct } from '$mp/utils/product'
import { isEthereumAddress } from '$mp/utils/validate'
import useAccountAddress from '$shared/hooks/useAccountAddress'
import useProduct from '../ProductController/useProduct'

export function useIsEthIdentityNeeded() {
    const product = useProduct()
    const isDataUnion = isDataUnionProduct(product)
    const dataUnion = useDataUnion()
    const { owner } = dataUnion || {}
    const { isLinked, ethereumIdentities } = useEthereumIdentities()

    const accountAddress = useAccountAddress()

    return useMemo(() => {
        let isRequired = false
        let requiredAddress
        let walletLocked = false

        if (isDataUnion) {
            const isDeployed = isDataUnion && isEthereumAddress(owner)
            const accountLinked = !!accountAddress && isLinked(accountAddress)
            const ownerLinked = !!owner && isLinked(owner)

            const noIdentities = (!ethereumIdentities || ethereumIdentities.length <= 0)
            walletLocked = (!isDeployed && !accountAddress)
            const noCurrentLink = (!isDeployed && !accountLinked)
            const noOwnerLink = (isDeployed && !ownerLinked)

            isRequired = noIdentities || walletLocked || noCurrentLink || noOwnerLink

            if (noOwnerLink) {
                requiredAddress = owner
            }
        }

        return {
            isRequired,
            requiredAddress,
            walletLocked,
        }
    }, [
        isDataUnion,
        owner,
        ethereumIdentities,
        isLinked,
        accountAddress,
    ])
}

export default useIsEthIdentityNeeded
