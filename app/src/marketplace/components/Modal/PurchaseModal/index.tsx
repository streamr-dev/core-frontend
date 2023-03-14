import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import ModalDialog from '$shared/components/ModalDialog'
import ModalPortal from '$shared/components/ModalPortal'
import useModal, { ModalApi } from "$shared/hooks/useModal"
import SvgIcon from '$shared/components/SvgIcon'
import { COLORS } from '$shared/utils/styled'
import Dialog from '$shared/components/Dialog'
import NoBalanceError from '$mp/errors/NoBalanceError'
import UnstyledLoadingIndicator from '$shared/components/LoadingIndicator'
import PngIcon from '$shared/components/PngIcon'

import { Step, usePurchaseStore } from './state'
import SelectChain from './SelectChain'
import ChooseAccessPeriod from './ChooseAccessPeriod'
import SetAllowance from './SetAllowance'
import Purchase from './Purchase'
import Complete from './Complete'
import Progress from './Progress'

const ModalContainer = styled.div`
    background: ${COLORS.secondary};
    color: ${COLORS.primary};
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`

const LoadingIndicator = styled(UnstyledLoadingIndicator)`
    height: 2px;
`

type BackLinkProps = {
    $shouldShow: boolean,
}

const BackLink = styled(Link)<BackLinkProps>`
    line-height: 30px;
    margin-bottom: 50px;
    visibility: ${({ $shouldShow }) => $shouldShow ? 'visible' : 'hidden'};
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

export const PurchaseDialog = ({ projectId, api }: Props) => {
    const [currentStep, setCurrentStep] = usePurchaseStore((state) => [state.currentStep, state.setCurrentStep])
    const goBack = usePurchaseStore((state) => state.goBack)
    const project = usePurchaseStore((state) => state.project)
    const loadProject = usePurchaseStore((state) => state.loadProject)
    const loadContractProject = usePurchaseStore((state) => state.loadContractProject)
    const needsAllowance = usePurchaseStore((state) => state.needsAllowance)
    const approveAllowance = usePurchaseStore((state) => state.approveAllowance)
    const purchaseProject = usePurchaseStore((state) => state.purchase)
    const [selectedPaymentDetails, setSelectedPaymentDetails] = usePurchaseStore((state) => [
        state.selectedPaymentDetails,
        state.setSelectedPaymentDetails,
    ])
    const setSelectedTimeUnit = usePurchaseStore((state) => state.setSelectedTimeUnit)
    const setSelectedLength = usePurchaseStore((state) => state.setSelectedLength)
    const tokenSymbol = usePurchaseStore((state) => state.tokenSymbol)
    const tokenDecimals = usePurchaseStore((state) => state.tokenDecimals)
    const isLoading = usePurchaseStore((state) => state.isLoading)
    const [error, setError] = usePurchaseStore((state) => [state.error, state.setError])

    useEffect(() => {
        if (projectId) {
            loadProject(projectId)
        }
    }, [projectId, loadProject])

    useEffect(() => {
        if (projectId && selectedPaymentDetails != null) {
            loadContractProject()
        }
    }, [projectId, loadContractProject, selectedPaymentDetails])

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

    useEffect(() => {
        if (currentStep < 0) {
            onClose()
        }
    }, [currentStep, onClose])

    const onPay = useCallback(async () => {
        const shouldSetAllowance = await needsAllowance()
        if (shouldSetAllowance) {
            setCurrentStep(Step.SetAllowance)
        } else {
            setCurrentStep(Step.Purchase)
        }
    }, [needsAllowance, setCurrentStep])

    return (
        <ModalPortal>
            <ModalDialog
                onClose={onClose}
                fullpage
                closeOnBackdropClick={false}
                closeOnEsc={false}
            >
                <ModalContainer>
                    <LoadingIndicator loading={isLoading} />
                    <Inner>
                        <BackLink to="#" onClick={goBack} $shouldShow={currentStep === Step.ChooseAccessPeriod}>
                            <BackButtonIcon name={'backArrow'}></BackButtonIcon>
                        </BackLink>
                        <SelectChain
                            visible={currentStep === Step.SelectChain}
                            paymentDetails={project?.paymentDetails ?? []}
                            onNextClicked={(details) => {
                                setSelectedPaymentDetails(details)
                                setCurrentStep(Step.ChooseAccessPeriod)
                            }}
                            onCancelClicked={onClose}
                        />
                        <ChooseAccessPeriod
                            // Show access period on background when purchasing
                            visible={currentStep === Step.ChooseAccessPeriod ||
                                currentStep === Step.Purchase ||
                                currentStep === Step.AccessProgress}
                            chainId={chainId}
                            tokenSymbol={tokenSymbol}
                            tokenDecimals={tokenDecimals}
                            paymentDetails={selectedPaymentDetails}
                            onPayClicked={async (length, unit) => {
                                setSelectedLength(length)
                                setSelectedTimeUnit(unit)
                                onPay()
                            }}
                        />
                        <SetAllowance
                            visible={currentStep === Step.SetAllowance}
                            tokenSymbol={tokenSymbol}
                            onConfirm={() => approveAllowance()}
                        />
                        <Complete
                            visible={currentStep === Step.Complete}
                            onConfirm={() => { onClose() }}
                        />
                    </Inner>
                </ModalContainer>
                {error != null && (
                    <ErrorDialog
                        error={error}
                        onClose={() => setError(null)}
                    />
                )}
                {currentStep === Step.Purchase && (
                    <Purchase
                        onConfirm={() => {
                            purchaseProject()
                        }}
                    />
                )}
                {currentStep === Step.AccessProgress && (
                    <Progress />
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
                useDarkBackdrop
                centerTitle
            >
                You don&apos;t have enough balance to purchase this project
            </Dialog>
        )
    }

    return (
        <Dialog
            title="Error"
            onClose={onClose}
            useDarkBackdrop
            centerTitle
        >
            <PngIcon name="walletError" />
            {error.message}
        </Dialog>
    )
}

const PurchaseModal = () => {
    const { isOpen, api, value } = useModal('purchaseProject')
    const resetStore = usePurchaseStore((state) => state.reset)

    useEffect(() => {
        if (!isOpen) {
            // Reset store after closing so that it's fresh next time
            resetStore()
        }
    }, [isOpen, resetStore])

    if (!isOpen) {
        return null
    }

    const { projectId } = value || {}
    return <PurchaseDialog projectId={projectId} api={api} />
}

export default PurchaseModal
