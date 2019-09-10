// @flow

import React, { useState, useCallback } from 'react'
import useModal from '$shared/hooks/useModal'
import { type Product } from '$mp/flowtype/product-types'
import GuidedDeployCommunityDialog from '$mp/components/Modal/GuidedDeployCommunityDialog'
import ConfirmDeployCommunityDialog from '$mp/components/Modal/ConfirmDeployCommunityDialog'
import DeployingCommunityDialog from '$mp/components/Modal/DeployingCommunityDialog'
import { isLocalStorageAvailable } from '$shared/utils/storage'

type DeployDialogProps = {
    product: Product,
    api: Object,
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

export const DeployDialog = ({ product, api }: DeployDialogProps) => {
    const dontShowAgain = skipGuide()
    const [step, setStep] = useState(dontShowAgain ? steps.CONFIRM : steps.GUIDE)

    const onClose = useCallback(() => {
        api.close(false)
    }, [api])

    const onDeploy = useCallback(() => {
        setStep(steps.COMPLETE)
    }, [])

    const onGuideContinue = useCallback((dontShow) => {
        setSkipGuide(dontShow)
        onDeploy()
    }, [onDeploy])

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

        default:
            return null
    }
}

export default () => {
    const { api, isOpen, value } = useModal('deployCommunity')

    if (!isOpen) {
        return null
    }

    const { product } = value

    return (
        <DeployDialog
            product={product}
            api={api}
        />
    )
}
