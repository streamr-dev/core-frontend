// @flow

import { useMemo, useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { selectPrivateKeys, selectIntegrationKeysError, selectFetchingIntegrationKeys } from '$shared/modules/integrationKey/selectors'
import { deleteIntegrationKey, fetchIntegrationKeys, createIntegrationKey, editIntegrationKey } from '$shared/modules/integrationKey/actions'
import type { IntegrationKeyId } from '$shared/flowtype/integration-key-types'

function useEthereumIdentities() {
    const dispatch = useDispatch()
    const privateKeys = useSelector(selectPrivateKeys)
    const error = useSelector(selectIntegrationKeysError)
    const fetching = useSelector(selectFetchingIntegrationKeys)

    const load = useCallback(() => {
        dispatch(fetchIntegrationKeys())
    }, [dispatch])

    const create = useCallback((keyName: string): Promise<void> => dispatch(createIntegrationKey(keyName)), [dispatch])

    const remove = useCallback((keyId: IntegrationKeyId): Promise<void> => dispatch(deleteIntegrationKey(keyId)), [dispatch])

    const edit = useCallback((keyId: IntegrationKeyId, keyName: string) => dispatch(editIntegrationKey(keyId, keyName)), [dispatch])

    return useMemo(() => ({
        load,
        fetching,
        privateKeys,
        error,
        create,
        remove,
        edit,
    }), [
        load,
        fetching,
        privateKeys,
        error,
        create,
        remove,
        edit,
    ])
}

export default useEthereumIdentities
