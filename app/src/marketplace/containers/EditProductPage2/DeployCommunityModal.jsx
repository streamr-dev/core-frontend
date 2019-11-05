// @flow

import React, { useState, useCallback, useEffect, useRef } from 'react'
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
import getWeb3 from '$shared/web3/web3Provider'
import { averageBlockTime } from '$shared/utils/web3'
import useIsMounted from '$shared/hooks/useIsMounted'

type DeployDialogProps = {
    product: Product,
    api: Object,
    updateAddress: (?Address) => void,
}

const steps = {
    GUIDE: 'guide',
    CONFIRM: 'deploy',
    COMPLETE: 'wait',
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

// allow 60s for the API to start in CP server
const API_READY_ESTIMATE = 60

export const DeployDialog = ({ product, api, updateAddress }: DeployDialogProps) => {
    const dontShowAgain = skipGuide()
    const [step, setStep] = useState(dontShowAgain ? steps.CONFIRM : steps.GUIDE)
    const [deployError, setDeployError] = useState(null)
    const [estimate, setEstimate] = useState(0)
    const [address, setAddress] = useState(null)
    const dispatch = useDispatch()
    const isMounted = useIsMounted()

    const onClose = useCallback(() => {
        api.close(!!address && isEthereumAddress(address))
    }, [api, address])
    const onCloseRef = useRef()
    onCloseRef.current = onClose

    const productId = product.id
    // $FlowFixMe
    const { adminFee = 0 } = product || {}
    const onDeploy = useCallback(async () => {
        const { id: joinPartStreamId } = await createJoinPartStream(productId)

        if (!isMounted()) { return Promise.resolve() }

        // Set estimate
        const blockEstimate = await averageBlockTime(getWeb3())
        setEstimate(blockEstimate + API_READY_ESTIMATE)

        if (!isMounted()) { return Promise.resolve() }

        return new Promise((resolve) => (
            deployContract(joinPartStreamId, adminFee)
                .onTransactionHash((hash, communityAddress) => {
                    if (!isMounted()) { return }
                    dispatch(addTransaction(hash, transactionTypes.DEPLOY_COMMUNITY))
                    setAddress(communityAddress)
                    setStep(steps.COMPLETE)
                    resolve()
                })
                .onTransactionComplete(({ contractAddress }) => {
                    if (!isMounted()) { return }
                    setAddress(contractAddress)

                    // Redirect back to product but allow the api to start up
                    setTimeout(() => {
                        if (isMounted() && onCloseRef.current) {
                            onCloseRef.current()
                        }
                    }, API_READY_ESTIMATE * 1000)
                })
                .onError((e) => {
                    if (!isMounted()) { return }
                    setDeployError(e)
                    resolve()
                })
        ))
    }, [isMounted, productId, adminFee, dispatch])

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

    if (deployError) {
        return (
            <ErrorDialog
                message={deployError.message}
                onClose={onClose}
            />
        )
    }

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
                    estimate={estimate}
                    onContinue={() => api.close(true)}
                    onClose={onClose}
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
