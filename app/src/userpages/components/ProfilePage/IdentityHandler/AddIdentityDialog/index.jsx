// @flow

import React, { useState, useCallback, useEffect } from 'react'
import { Translate } from 'react-redux-i18n'

import useWeb3Status from '$shared/hooks/useWeb3Status'
import Web3ErrorDialog from '$shared/components/Web3ErrorDialog'
import useEthereumIdentities from '$shared/modules/integrationKey/hooks/useEthereumIdentities'
import useModal from '$shared/hooks/useModal'
import type { Address } from '$shared/flowtype/web3-types'
import UnlockWalletDialog from '$shared/components/Web3ErrorDialog/UnlockWalletDialog'
import { areAddressesEqual } from '$mp/utils/smartContract'
import { truncate } from '$shared/utils/text'

import IdentityNameDialog from '../IdentityNameDialog'
import IdentityChallengeDialog from '../IdentityChallengeDialog'
import DuplicateIdentityDialog from '../IdentityChallengeDialog/DuplicateIdentityDialog'

type Props = {
    api: Object,
    requiredAddress?: Address,
}

const identityPhases = {
    NAME: 'name',
    CHALLENGE: 'challenge',
    COMPLETE: 'complete',
}

const AddIdentityDialog = ({ api, requiredAddress }: Props) => {
    const { web3Error, checkingWeb3, account } = useWeb3Status()
    const { load: getEthIdentities, fetching, create, isLinked } = useEthereumIdentities()
    const [phase, setPhase] = useState(identityPhases.NAME)
    const [result, setResult] = useState(false)

    const onSetName = useCallback((name: string) => {
        setPhase(identityPhases.CHALLENGE)

        try {
            create(name)
            setResult(true)
        } catch (e) {
            console.warn(e)
        }
    }, [create])

    const onClose = useCallback(() => {
        api.close(result)
    }, [api, result])

    useEffect(() => {
        getEthIdentities()
    }, [getEthIdentities])

    if (fetching || checkingWeb3 || web3Error || !account) {
        return (
            <Web3ErrorDialog
                waiting={fetching || checkingWeb3}
                onClose={onClose}
                error={web3Error}
            />
        )
    }

    if (!!requiredAddress && (!account || !areAddressesEqual(account, requiredAddress))) {
        return (
            <UnlockWalletDialog onClose={onClose}>
                <Translate
                    value="unlockWalletDialog.message"
                    address={truncate(requiredAddress, {
                        maxLength: 15,
                    })}
                    tag="p"
                />
            </UnlockWalletDialog>
        )
    }

    switch (phase) {
        case identityPhases.NAME: {
            // Check if account is already linked and show an error.
            if (isLinked(account)) {
                return (
                    <DuplicateIdentityDialog
                        onClose={onClose}
                    />
                )
            }

            return (
                <IdentityNameDialog
                    onClose={onClose}
                    onSave={onSetName}
                />
            )
        }

        case identityPhases.CHALLENGE:
            return (
                <IdentityChallengeDialog
                    onClose={onClose}
                />
            )
        default:
            return null
    }
}

export default () => {
    const { api, isOpen, value } = useModal('userpages.addIdentity')

    if (!isOpen) {
        return null
    }

    const { requiredAddress } = value || {}

    return (
        <AddIdentityDialog
            api={api}
            requiredAddress={requiredAddress}
        />
    )
}
