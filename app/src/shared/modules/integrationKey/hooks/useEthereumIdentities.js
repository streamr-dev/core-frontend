// @flow

import { useMemo, useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import type { Address } from '$shared/flowtype/web3-types'
import { selectEthereumIdentities } from '$shared/modules/integrationKey/selectors'
import { areAddressesEqual } from '$mp/utils/smartContract'
import { fetchIntegrationKeys } from '$shared/modules/integrationKey/actions'

function useEthereumIdentities() {
    const dispatch = useDispatch()
    const ethereumIdentities = useSelector(selectEthereumIdentities)

    const load = useCallback(() => {
        dispatch(fetchIntegrationKeys())
    }, [dispatch])

    // Check if current metamask account is linked to Streamr account
    const isLinked = useCallback((account: Address) => (
        !!(ethereumIdentities &&
        account &&
        ethereumIdentities.find(({ json }) =>
            json && json.address && areAddressesEqual(json.address, account))
        )
    ), [ethereumIdentities])

    return useMemo(() => ({
        load,
        ethereumIdentities,
        isLinked,
    }), [
        load,
        ethereumIdentities,
        isLinked,
    ])
}

export default useEthereumIdentities
