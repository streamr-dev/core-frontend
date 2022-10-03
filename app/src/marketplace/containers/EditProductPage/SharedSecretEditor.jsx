// @flow

import React, { useCallback } from 'react'
import styled from 'styled-components'

import Button from '$shared/components/Button'
import UnstyledKeyField from '$shared/components/KeyField'
import AddKeyField from '$shared/components/KeyField/AddKeyField'
import useDataUnionSecrets from '$mp/modules/dataUnion/hooks/useDataUnionSecrets'
import type { Secret } from '$mp/modules/dataUnion/types'
import { usePending } from '$shared/hooks/usePending'
import { getChainIdFromApiString } from '$shared/utils/chains'
import useRequireNetwork from '$shared/hooks/useRequireNetwork'
import getProviderChainId from '$utils/web3/getProviderChainId'
import { useController } from '../ProductController'

const KeyField = styled(UnstyledKeyField)``
const AddKeyFieldWrapper = styled.div``

const LoadButton = styled(Button)`
    margin-bottom: 2rem;
`

const Empty = styled.div`
    font-size: 14px;
`

type Props = {
    disabled?: boolean,
}

const UnstyledSharedSecretEditor = ({ disabled, ...props }: Props) => {
    const { product } = useController()
    const {
        load,
        isLoading,
        secrets,
        edit,
        add,
        remove,
    } = useDataUnionSecrets()
    const dataUnionId = (product && product.beneficiaryAddress) || ''
    const chainId = getChainIdFromApiString(product.chain)
    const { isPending: isAddPending, wrap: wrapAddSecret } = usePending('product.ADD_SECRET')
    const { isPending: isEditPending, wrap: wrapEditSecret } = usePending('product.EDIT_SECRET')
    const { isPending: isRemovePending, wrap: wrapRemoveSecret } = usePending('product.REMOVE_SECRET')
    const { validateNetwork } = useRequireNetwork(chainId, false)

    const checkNetwork = useCallback(async () => {
        if (getProviderChainId() !== chainId) {
            await validateNetwork(true)
            // We need to wait a bit to make sure MetaMask has done it's thing
            await new Promise((r) => setTimeout(r, 700))
        }
    }, [validateNetwork, chainId])

    const loadSecrets = useCallback(async (id) => {
        await checkNetwork()
        await load(id, chainId)
    }, [chainId, load, checkNetwork])

    const addSecret = useCallback(async (name) => (
        wrapAddSecret(async () => {
            await checkNetwork()
            await add({
                dataUnionId,
                name,
                chainId,
            })
        })
    ), [wrapAddSecret, dataUnionId, add, chainId, checkNetwork])

    const editSecret = useCallback(async (id, name) => (
        wrapEditSecret(async () => {
            await checkNetwork()
            await edit({
                dataUnionId,
                id,
                name,
                chainId,
            })
        })
    ), [wrapEditSecret, dataUnionId, edit, chainId, checkNetwork])

    const removeSecret = useCallback(async (id) => (
        wrapRemoveSecret(async () => {
            await checkNetwork()
            await remove({
                dataUnionId,
                id,
                chainId,
            })
        })
    ), [wrapRemoveSecret, dataUnionId, remove, chainId, checkNetwork])

    const isDisabled = !!(disabled || isAddPending || isEditPending || isRemovePending)

    return (
        <div {...props}>
            {isLoading === null && (
                <LoadButton
                    onClick={() => loadSecrets(dataUnionId)}
                    disabled={isLoading || isDisabled}
                >
                    Load secrets
                </LoadButton>
            )}
            {secrets.map((s: Secret) => (
                <KeyField
                    key={s.secret}
                    keyName={s.name}
                    value={s.secret}
                    hideValue
                    /* Editing secret's name is disabled for now as there is no support for it in DU client */
                    allowEdit={false}
                    allowDelete={!isDisabled}
                    onSave={async (name) => editSecret(s.secret, name)}
                    onDelete={async () => removeSecret(s.secret)}
                    labelType="sharedSecret"
                />
            ))}
            {isLoading === false && secrets.length === 0 && (
                <Empty>You haven&apos;t created any secrets yet</Empty>
            )}
            {isLoading === false && (
                <AddKeyFieldWrapper>
                    <AddKeyField
                        label="Add shared secret"
                        addKeyFieldAllowed={!isDisabled}
                        labelType="sharedSecret"
                        onSave={async (name) => addSecret(name)}
                    />
                </AddKeyFieldWrapper>
            )}
        </div>
    )
}

const SharedSecretEditor = styled(UnstyledSharedSecretEditor)`
    margin-top: 2rem;

    ${KeyField} + ${KeyField} {
        margin-top: 1.5rem;
    }

    ${AddKeyFieldWrapper} {
        margin-top: 2rem;
    }
`

export default SharedSecretEditor
