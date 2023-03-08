import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import ModalDialog from '$shared/components/ModalDialog'
import ModalPortal from '$shared/components/ModalPortal'
import useModal, { ModalApi } from "$shared/hooks/useModal"
import SvgIcon from '$shared/components/SvgIcon'
import { COLORS } from '$shared/utils/styled'
import usePurchase, { actionsTypes } from '$shared/hooks/usePurchase'
import useIsMounted from '$shared/hooks/useIsMounted'
import { transactionStates } from '$shared/utils/constants'
import { getProject, getProjectFromRegistry, TheGraphPaymentDetails, TheGraphProject } from '$app/src/services/projects'
import Dialog from '$shared/components/Dialog'
import NoBalanceError from '$mp/errors/NoBalanceError'

import SelectChain from './SelectChain'
import ChooseAccessPeriod from './ChooseAccessPeriod'
import CompleteAccess from './CompleteAccess'

const ModalContainer = styled.div`
    background: ${COLORS.secondary};
    color: ${COLORS.primary};
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`

const OverlayContainer = styled.div`
    background: rgba(50, 50, 50, 0.5);
    color: ${COLORS.primary};
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
`

const BackLink = styled(Link)`
    line-height: 30px;
    margin-bottom: 50px;
`

const BackButtonIcon = styled(SvgIcon)`
    color: ${COLORS.primaryLight};
`

const Inner = styled.div`
    width: 528px;
    align-self: center;
    padding-top: 80px;
`

type Props = {
    projectId: string,
    api: ModalApi,
}

enum Step {
    SelectChain,
    ChooseAccessPeriod,
    CompleteAccess,
}

export const PurchaseDialog = ({ projectId, api }: Props) => {
    const isMounted = useIsMounted()
    const [project, setProject] = useState<TheGraphProject>(null)
    const [selectedPaymentDetails, setSelectedPaymentDetails] = useState<TheGraphPaymentDetails>(null)
    const [selectedLength, setSelectedLength] = useState<string>(null)
    const [selectedTimeUnit, setSelectedTimeUnit] = useState<string>(null)
    const [tokenSymbol, setTokenSymbol] = useState<string>(null)
    const [tokenDecimals, setTokenDecimals] = useState<number>(null)
    const [currentStep, setCurrentStep] = useState<Step>(Step.SelectChain)
    const [error, setError] = useState<Error>(null)
    const purchase = usePurchase()

    useEffect(() => {
        const loadProject = async () => {
            const proj = await getProject(projectId)
            if (isMounted() && proj) {
                setProject(proj)
            }
        }

        loadProject()
    }, [projectId, isMounted])

    const chainId = useMemo(() => {
        if (selectedPaymentDetails != null) {
            const parsedChainId = Number.parseInt(selectedPaymentDetails.domainId)
            if (!Number.isSafeInteger(parsedChainId)) {
                console.error("Invalid paymentDetails chain! domainId is not a number", selectedPaymentDetails.domainId)
            }
            return parsedChainId
        }

        return null
    }, [selectedPaymentDetails])

    const onClose = useCallback(() => {
        api.close()
    }, [api])

    const goBack = useCallback(() => {
        if (currentStep === 0) {
            onClose()
        } else {
            setCurrentStep((prev) => prev - 1)
        }
    }, [onClose, currentStep])

    const onPurchase = useCallback(async () => {
        try {
            const contractProject = await getProjectFromRegistry(project.id, [selectedPaymentDetails.domainId], true)
            const { queue } = await purchase({
                contractProject: contractProject,
                length: selectedLength,
                timeUnit: selectedTimeUnit,
                chainId: chainId,
            })

            await queue
                .subscribe('status', (id, nextStatus, hash) => {
                    if (id === actionsTypes.SUBSCRIPTION && nextStatus === transactionStates.CONFIRMED) {
                        // Payment succeeded
                        onClose()
                    }
                })
                .start()
        } catch (e) {
            setError(e)
        }
    }, [purchase, project, selectedLength, selectedPaymentDetails, selectedTimeUnit, chainId, onClose])

    return (
        <ModalPortal>
            <ModalDialog
                onClose={onClose}
                fullpage
            >
                <ModalContainer>
                    <Inner>
                        <BackLink to="#" onClick={goBack}>
                            <BackButtonIcon name={'backArrow'}></BackButtonIcon>
                        </BackLink>
                        <SelectChain
                            visible={currentStep === Step.SelectChain}
                            paymentDetails={project?.paymentDetails ?? []}
                            onNextClicked={(details) => {
                                setSelectedPaymentDetails(details)
                                setCurrentStep(Step.ChooseAccessPeriod)
                            }}
                        />
                        <ChooseAccessPeriod
                            visible={currentStep === Step.ChooseAccessPeriod}
                            chainId={chainId}
                            paymentDetails={selectedPaymentDetails}
                            onNextClicked={(length, unit, symbol, decimals) => {
                                setSelectedLength(length)
                                setSelectedTimeUnit(unit)
                                setTokenSymbol(symbol)
                                setTokenDecimals(decimals)
                                setCurrentStep(Step.CompleteAccess)
                            }}
                        />
                        <CompleteAccess
                            visible={currentStep === Step.CompleteAccess}
                            paymentDetails={selectedPaymentDetails}
                            chainId={chainId}
                            length={selectedLength}
                            timeUnit={selectedTimeUnit}
                            tokenSymbol={tokenSymbol}
                            tokenDecimals={tokenDecimals}
                            projectName={project?.metadata.name || project?.id}
                            onPayClicked={onPurchase}
                        />
                    </Inner>
                </ModalContainer>
                {error != null && (
                    <OverlayContainer>
                        <ErrorDialog
                            error={error}
                            onClose={() => setError(null)}
                        />
                    </OverlayContainer>
                )}
            </ModalDialog>
        </ModalPortal>
    )
}

type ErrorDialogProps = {
    error: Error,
    onClose: () => void,
}

const ErrorDialog = ({ error, onClose }: ErrorDialogProps) => {
    if (error instanceof NoBalanceError) {
        return (
            <Dialog
                title="No balance"
                onClose={onClose}
            >
                You don&apos;t have enough balance to purchase this project
            </Dialog>
        )
    }

    return (
        <Dialog
            title="Error"
            onClose={onClose}
        >
            {error.message}
        </Dialog>
    )
}

const PurchaseModal = () => {
    const { isOpen, api, value } = useModal('purchaseProject')

    if (!isOpen) {
        return null
    }

    const { projectId } = value || {}
    return <PurchaseDialog projectId={projectId} api={api} />
}

export default PurchaseModal
