// @flow

import { useMemo, useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import type { Address } from '$shared/flowtype/web3-types'
import { selectEthereumIdentities, selectIntegrationKeysError, selectFetchingIntegrationKeys } from '$shared/modules/integrationKey/selectors'
import { areAddressesEqual } from '$mp/utils/smartContract'
import { deleteIntegrationKey, fetchIntegrationKeys, createIdentity, editIntegrationKey } from '$shared/modules/integrationKey/actions'
import type { IntegrationKeyId } from '$shared/flowtype/integration-key-types'

function useEthereumIdentities() {
    const dispatch = useDispatch()
    const ethereumIdentities = useSelector(selectEthereumIdentities)
    const error = useSelector(selectIntegrationKeysError)
    const fetching = useSelector(selectFetchingIntegrationKeys)

    const load = useCallback(() => {
        dispatch(fetchIntegrationKeys())
    }, [dispatch])

    const create = useCallback((keyName: string): Promise<void> => dispatch(createIdentity(keyName)), [dispatch])

    const remove = useCallback((keyId: IntegrationKeyId): Promise<void> => dispatch(deleteIntegrationKey(keyId)), [dispatch])

    const edit = useCallback((keyId: IntegrationKeyId, keyName: string) => dispatch(editIntegrationKey(keyId, keyName)), [dispatch])

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
        fetching,
        ethereumIdentities,
        error,
        isLinked,
        create,
        remove,
        edit,
    }), [
        load,
        fetching,
        ethereumIdentities,
        error,
        isLinked,
        create,
        remove,
        edit,
    ])
}

export default useEthereumIdentities
