// @flow

import React, { useState, useCallback } from 'react'
import useModal from '$shared/hooks/useModal'
import { type Product } from '$mp/flowtype/product-types'
import GuidedDeployCommunityDialog from '$mp/components/Modal/GuidedDeployCommunityDialog'
import ConfirmDeployCommunityDialog from '$mp/components/Modal/ConfirmDeployCommunityDialog'

type DeployDialogProps = {
    product: Product,
    api: Object,
}

const steps = {
    GUIDE: 'guide',
    CONFIRM: 'deploy',
    COMPLETE: 'wait',
}

export const DeployDialog = ({ product, api }: DeployDialogProps) => {
    const [step, setStep] = useState(steps.CONFIRM)

    const onClose = useCallback(() => {
        api.close(false)
    }, [api])

    const onDeploy = useCallback(() => {
        setStep(steps.COMPLETE)
    }, [])

    const onGuideContinue = useCallback((dontShowAgain) => {
        console.log(dontShowAgain)
        onDeploy()
    }, [onDeploy])

    switch (step) {
        case steps.GUIDE:
            return (
                <GuidedDeployCommunityDialog
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
