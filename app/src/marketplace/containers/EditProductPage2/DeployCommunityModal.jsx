// @flow

import React, { useState, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import useModal from '$shared/hooks/useModal'
import { type Product } from '$mp/flowtype/product-types'
import GuidedDeployCommunityDialog from '$mp/components/Modal/GuidedDeployCommunityDialog'
import ConfirmDeployCommunityDialog from '$mp/components/Modal/ConfirmDeployCommunityDialog'
import DeployingCommunityDialog from '$mp/components/Modal/DeployingCommunityDialog'
import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import { isLocalStorageAvailable } from '$shared/utils/storage'
import withWeb3 from '$shared/utils/withWeb3'
import { deployContract, createJoinPartStream } from '$mp/modules/communityProduct/services'
import { isEthereumAddress } from '$mp/utils/validate'
import type { Address } from '$shared/flowtype/web3-types'
import { addTransaction } from '$mp/modules/transactions/actions'
import { transactionTypes } from '$shared/utils/constants'

type DeployDialogProps = {
    product: Product,
    api: Object,
    updateAddress: (?Address) => void,
}

const steps = {
    GUIDE: 'guide',
    CONFIRM: 'deploy',
    COMPLETE: 'wait',
    ERROR: 'error',
}

const SKIP_GUIDE_KEY = 'marketplace.skipCpDeployGuide'
const storage = isLocalStorageAvailable() ? window.localStorage : null

function skipGuide(): boolean {
    return !!(storage && JSON.parse(storage.getItem(SKIP_GUIDE_KEY) || 'false'))
}

function setSkipGuide(value) {
    if (!storage) { return }
    storage.setItem(SKIP_GUIDE_KEY, JSON.stringify(value))
}

export const DeployDialog = ({ product, api, updateAddress }: DeployDialogProps) => {
    const dontShowAgain = skipGuide()
    const [step, setStep] = useState(dontShowAgain ? steps.CONFIRM : steps.GUIDE)
    const [address, setAddress] = useState(null)
    const dispatch = useDispatch()

    const onClose = useCallback(() => {
        api.close(!!address && isEthereumAddress(address))
    }, [api, address])

    const productId = product.id
    // $FlowFixMe
    const { adminFee = 0 } = product || {}
    const onDeploy = useCallback(async () => {
        const { id: joinPartStreamId } = await createJoinPartStream(productId)

        return new Promise((resolve) => (
            deployContract(joinPartStreamId, adminFee)
                .onTransactionHash((hash, communityAddress) => {
                    dispatch(addTransaction(hash, transactionTypes.DEPLOY_COMMUNITY))
                    setAddress(communityAddress)
                    setStep(steps.COMPLETE)
                    resolve()
                })
                .onTransactionComplete(({ contractAddress }) => {
                    setAddress(contractAddress)
                })
                .onError(() => {
                    setStep(steps.ERROR)
                    resolve()
                })
        ))
    }, [productId, adminFee, dispatch])

    const onGuideContinue = useCallback((dontShow) => {
        setSkipGuide(dontShow)
        return onDeploy()
    }, [onDeploy])

    // Update beneficiary address to product as soon as it changes
    useEffect(() => {
        if (address) {
            updateAddress(address)
        }
    }, [address, updateAddress])

    switch (step) {
        case steps.GUIDE:
            return (
                <GuidedDeployCommunityDialog
                    dontShowAgain={dontShowAgain}
                    product={product}
                    onContinue={onGuideContinue}
                    onClose={onClose}
                />
            )

        case steps.CONFIRM:
            return (
                <ConfirmDeployCommunityDialog
                    product={product}
                    onContinue={onDeploy}
                    onShowGuidedDialog={() => setStep(steps.GUIDE)}
                    onClose={onClose}
                />
            )

        case steps.COMPLETE:
            return (
                <DeployingCommunityDialog
                    product={product}
                    onContinue={() => api.close(true)}
                    onClose={onClose}
                />
            )

        case steps.ERROR:
            return (
                <ErrorDialog
                    message="error.message"
                    onClose={() => api.close(false)}
                />
            )

        default:
            return null
    }
}

export const DeployDialogWithWeb3 = withWeb3(DeployDialog)

export default () => {
    const { api, isOpen, value } = useModal('deployCommunity')

    if (!isOpen) {
        return null
    }

    const { product, updateAddress } = value

    return (
        <DeployDialogWithWeb3
            product={product}
            api={api}
            onClose={() => api.close(false)}
            updateAddress={updateAddress}
        />
    )
}
