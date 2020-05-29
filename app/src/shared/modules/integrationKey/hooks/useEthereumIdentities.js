// @flow

import { useMemo, useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import getWeb3, { getPublicWeb3 } from '$shared/web3/web3Provider'
import type { Address } from '$shared/flowtype/web3-types'
import { selectEthereumIdentities, selectIntegrationKeysError, selectFetchingIntegrationKeys } from '$shared/modules/integrationKey/selectors'
import { areAddressesEqual } from '$mp/utils/smartContract'
import { deleteIntegrationKey, fetchIntegrationKeys, createIdentity, editIntegrationKey } from '$shared/modules/integrationKey/actions'
import type { IntegrationKeyId, Account } from '$shared/flowtype/integration-key-types'

function useEthereumIdentities() {
    const dispatch = useDispatch()
    const ethereumIdentities = useSelector(selectEthereumIdentities)
    const error = useSelector(selectIntegrationKeysError)
    const fetching = useSelector(selectFetchingIntegrationKeys)

    const load = useCallback(() => (
        dispatch(fetchIntegrationKeys())
    ), [dispatch])

    const create = useCallback(async (name: string): Promise<Account> => {
        const web3 = getPublicWeb3()
        const { address, privateKey } = web3.eth.accounts.create()
        const signChallenge = async (challenge) => {
            const { signature } = await web3.eth.accounts.sign(challenge, privateKey)

            return signature
        }

        const id = await dispatch(createIdentity({
            name,
            address,
            signChallenge,
        }))

        return {
            id,
            name,
            address,
            privateKey,
        }
    }, [dispatch])

    const connect = useCallback(async (name: string): Promise<Account> => {
        const web3 = getWeb3()
        const address = await web3.getDefaultAccount()
        const signChallenge = async (challenge) => web3.eth.personal.sign(
            challenge,
            address,
            '', // required, but MetaMask will ignore the password argument here
        )

        const id = await dispatch(createIdentity({
            name,
            address,
            signChallenge,
        }))

        return {
            id,
            name,
            address,
        }
    }, [dispatch])

    const remove = useCallback((keyId: IntegrationKeyId): Promise<void> => dispatch(deleteIntegrationKey(keyId)), [dispatch])

    const edit = useCallback((keyId: IntegrationKeyId, keyName: string) => dispatch(editIntegrationKey(keyId, keyName)), [dispatch])

    const getIdentity = useCallback((account: Address) => (
        ethereumIdentities &&
        account &&
        ethereumIdentities.find(({ json }) => (json && json.address && areAddressesEqual(json.address, account)))
    ), [ethereumIdentities])

    // Check if current metamask account is linked to Streamr account
    const isLinked = useCallback((account: Address) => !!getIdentity(account), [getIdentity])

    return useMemo(() => ({
        load,
        fetching,
        ethereumIdentities,
        error,
        getIdentity,
        isLinked,
        create,
        connect,
        remove,
        edit,
    }), [
        load,
        fetching,
        ethereumIdentities,
        error,
        getIdentity,
        isLinked,
        create,
        connect,
        remove,
        edit,
    ])
}

export default useEthereumIdentities
