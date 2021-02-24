// @flow

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'

import useWeb3Status from '$shared/hooks/useWeb3Status'
import Web3ErrorDialog from '$shared/components/Web3ErrorDialog'
import useEthereumIdentities from '$shared/modules/integrationKey/hooks/useEthereumIdentities'
import useModal from '$shared/hooks/useModal'
import type { Address } from '$shared/flowtype/web3-types'
import UnlockWalletDialog from '$shared/components/Web3ErrorDialog/UnlockWalletDialog'
import { areAddressesEqual } from '$mp/utils/smartContract'
import { ErrorCodes } from '$shared/errors/Web3'
import { usePending } from '$shared/hooks/usePending'
import { type UseStateTuple } from '$shared/flowtype/common-types'
import { type Account } from '$shared/flowtype/integration-key-types'
import useIsMounted from '$shared/hooks/useIsMounted'

import IdentityNameDialog from '../IdentityNameDialog'
import { IdentityChallengeDialog, DuplicateIdentityDialog } from '../IdentityChallengeDialog'
import CopyPrivateKeyDialog from '../CopyPrivateKeyDialog'
import EthereumAccountCreatedDialog from '../EthereumAccountCreatedDialog'

type Props = {
    api: Object,
    requiredAddress?: Address,
    createAccount: boolean,
}

const identityPhases = {
    NAME: 'name',
    CHALLENGE: 'challenge',
    ACCOUNT_CREATED: 'accountCreated',
    RENAME_ACCOUNT: 'renameAccount',
    COPY_PRIVATE_KEY: 'copyPrivateKey',
}

const AddIdentityDialog = ({ api, requiredAddress, createAccount }: Props) => {
    const { web3Error, checkingWeb3, account: walletAddress } = useWeb3Status(!createAccount)
    const {
        load: getEthIdentities,
        fetching,
        connect,
        create,
        edit,
        isLinked,
    } = useEthereumIdentities()
    const isMounted = useIsMounted()
    const [phase, setPhase] = useState(identityPhases.NAME)
    const { wrap, isPending } = usePending('user.ADD_IDENTITY')
    const [linkedAccount, setLinkedAccount]: UseStateTuple<Account> = useState({})
    const linkedAccountRef = useRef()
    linkedAccountRef.current = linkedAccount

    const connectMethod = useMemo(
        () => (createAccount ? create : connect),
        [createAccount, create, connect],
    )

    const onSetName = useCallback(async (name: string) => (
        wrap(async () => {
            if (!createAccount) {
                setPhase(identityPhases.CHALLENGE)
            }

            let added = false
            let error

            try {
                const newAccount = await connectMethod(name)

                if (isMounted()) {
                    setLinkedAccount(newAccount)
                }

                added = true
            } catch (e) {
                console.warn(e)
                error = e
            } finally {
                if (createAccount && !error) {
                    if (isMounted()) {
                        setPhase(identityPhases.ACCOUNT_CREATED)
                    }
                } else if (!error || error.code !== ErrorCodes.IDENTITY_EXISTS) {
                    api.close({
                        added,
                        error,
                    })
                }
            }
        })
    ), [wrap, connectMethod, api, createAccount, isMounted])

    const onClose = useCallback(() => {
        const { address } = linkedAccountRef.current || {}

        api.close({
            added: !!address,
            error: undefined,
        })
    }, [api])

    const onRename = useCallback(async (name: string) => (
        wrap(async () => {
            const { id, name: oldName } = linkedAccountRef.current || {}

            if (name !== oldName) {
                try {
                    await edit(id, name)

                    if (isMounted()) {
                        setLinkedAccount((prev) => ({
                            ...prev,
                            name,
                        }))
                    }
                } catch (e) {
                    console.warn(e)
                }
            }

            if (isMounted()) {
                setPhase(identityPhases.ACCOUNT_CREATED)
            }
        })
    ), [wrap, edit, isMounted])

    useEffect(() => {
        getEthIdentities()
    }, [getEthIdentities])

    if (fetching && phase === identityPhases.NAME) {
        return null
    }

    if (!checkingWeb3 && (web3Error || (!createAccount && !walletAddress))) {
        return (
            <Web3ErrorDialog
                waiting={fetching || checkingWeb3}
                onClose={onClose}
                error={web3Error}
            />
        )
    }

    if (!checkingWeb3 && !!requiredAddress && (!walletAddress || !areAddressesEqual(walletAddress, requiredAddress))) {
        return (
            <UnlockWalletDialog onClose={onClose} requiredAddress={requiredAddress}>
                <p>
                    Please select the account with address
                </p>
            </UnlockWalletDialog>
        )
    }

    switch (phase) {
        case identityPhases.NAME: {
            // Check if account is already linked and show an error.
            if (!createAccount && walletAddress && isLinked(walletAddress)) {
                return (
                    <DuplicateIdentityDialog
                        onClose={onClose}
                    />
                )
            }

            return (
                <IdentityNameDialog
                    onCancel={onClose}
                    onClose={onClose}
                    onSave={onSetName}
                    waiting={isPending}
                    disabled={checkingWeb3}
                />
            )
        }

        case identityPhases.CHALLENGE:
            return (
                <IdentityChallengeDialog
                    onClose={onClose}
                />
            )

        case identityPhases.ACCOUNT_CREATED:
            return (
                <EthereumAccountCreatedDialog
                    name={linkedAccount.name || ''}
                    address={linkedAccount.address || ''}
                    onBack={() => setPhase(identityPhases.RENAME_ACCOUNT)}
                    onSave={() => setPhase(identityPhases.COPY_PRIVATE_KEY)}
                />
            )

        case identityPhases.RENAME_ACCOUNT:
            return (
                <IdentityNameDialog
                    onClose={() => {}}
                    onCancel={() => setPhase(identityPhases.ACCOUNT_CREATED)}
                    onSave={onRename}
                    initialValue={linkedAccount.name || ''}
                    waiting={isPending}
                />
            )

        case identityPhases.COPY_PRIVATE_KEY:
            return (
                <CopyPrivateKeyDialog
                    privateKey={linkedAccount.privateKey || ''}
                    onClose={onClose}
                />
            )

        default:
            return null
    }
}

AddIdentityDialog.defaultProps = {
    createAccount: false,
}

export default () => {
    const { api, isOpen, value } = useModal('userpages.addIdentity')

    if (!isOpen) {
        return null
    }

    const { requiredAddress, createAccount } = value || {}

    return (
        <AddIdentityDialog
            api={api}
            requiredAddress={requiredAddress}
            createAccount={!!createAccount}
        />
    )
}
