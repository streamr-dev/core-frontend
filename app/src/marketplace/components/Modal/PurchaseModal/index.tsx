import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import ModalDialog from '$shared/components/ModalDialog'
import ModalPortal from '$shared/components/ModalPortal'
import useModal, { ModalApi } from "$shared/hooks/useModal"
import SvgIcon from '$shared/components/SvgIcon'
import { TimeUnit } from '$shared/types/common-types'
import { COLORS } from '$shared/utils/styled'
import usePurchase, { actionsTypes } from '$shared/hooks/usePurchase'
import useApproveAllowance from '$shared/hooks/useApproveAllowance'
import { transactionStates } from '$shared/utils/constants'
import { getProject, getProjectFromRegistry, SmartContractProject, TheGraphPaymentDetails, TheGraphProject } from '$app/src/services/projects'
import Dialog from '$shared/components/Dialog'
import NoBalanceError from '$mp/errors/NoBalanceError'
import TransactionRejectedError from '$shared/errors/TransactionRejectedError'
import TransactionError from '$shared/errors/TransactionError'

import { Step, usePurchaseStore } from './state'
import SelectChain from './SelectChain'
import ChooseAccessPeriod from './ChooseAccessPeriod'
import SetAllowance from './SetAllowance'
import Purchase from './Purchase'
import Complete from './Complete'

const ModalContainer = styled.div`
    background: ${COLORS.secondary};
    color: ${COLORS.primary};
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
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

export const PurchaseDialog = ({ projectId, api }: Props) => {
    const [selectedTimeUnit, setSelectedTimeUnit] = useState<TimeUnit>(null)
    const [selectedLength, setSelectedLength] = useState<string>(null)
    const [error, setError] = useState<Error>(null)

    const [currentStep, setCurrentStep] = usePurchaseStore((state) => [state.currentStep, state.setCurrentStep])
    const goBack = usePurchaseStore((state) => state.goBack)
    const project = usePurchaseStore((state) => state.project)
    const loadProject = usePurchaseStore((state) => state.loadProject)
    const contractProject = usePurchaseStore((state) => state.contractProject)
    const loadContractProject = usePurchaseStore((state) => state.loadContractProject)
    const [selectedPaymentDetails, setSelectedPaymentDetails] = usePurchaseStore((state) => [
        state.selectedPaymentDetails,
        state.setSelectedPaymentDetails,
    ])

    console.log(usePurchaseStore())

    const purchase = usePurchase()
    const { needsAllowance, approve } = useApproveAllowance()

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

    const setAllowance = useCallback(async () => {
        try {
            const approveTx = approve({
                contractProject,
                chainId,
                length: selectedLength,
                timeUnit: selectedTimeUnit,
            })

            approveTx
                .onTransactionHash((hash) => {
                    console.log('started', hash)
                })
                .onTransactionComplete(() => {
                    console.log('complete')
                    setCurrentStep(Step.Purchase)
                })
                .onError((error) => {
                    setError(error)
                    setCurrentStep(Step.ChooseAccessPeriod)
                })
        } catch (e) {
            setError(e)
            setCurrentStep(Step.ChooseAccessPeriod)
            return
        }
    }, [approve, chainId, contractProject, selectedLength, selectedTimeUnit, setCurrentStep])

    const onPurchase = useCallback(async () => {
        try {
            const { queue } = await purchase({
                contractProject: contractProject,
                length: selectedLength,
                timeUnit: selectedTimeUnit,
                chainId: chainId,
            })

            await queue
                .subscribe('status', (id, nextStatus, error) => {
                    if (error instanceof TransactionRejectedError) {
                        // Maybe do something different here?
                        setError(error)
                    } else if (error instanceof TransactionError) {
                        // Maybe do something different here?
                        setError(error)
                    } else if (error instanceof Error) {
                        // Maybe do something different here?
                        setError(error)
                    }
                    if (id === actionsTypes.SUBSCRIPTION && nextStatus === transactionStates.CONFIRMED) {
                        // Payment succeeded
                        onClose()
                    }
                })
                .start()
        } catch (e) {
            setError(e)
        }
    }, [purchase, contractProject, selectedLength, selectedTimeUnit, chainId, onClose])

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
                            // Show access period on background when purchasing
                            visible={currentStep === Step.ChooseAccessPeriod || currentStep === Step.Purchase}
                            chainId={chainId}
                            paymentDetails={selectedPaymentDetails}
                            onPayClicked={async (length, unit) => {
                                setSelectedLength(length)
                                setSelectedTimeUnit(unit)

                                const shouldSetAllowance = await needsAllowance({
                                    contractProject,
                                    chainId,
                                    length,
                                    timeUnit: unit,
                                })
                                if (shouldSetAllowance) {
                                    setCurrentStep(Step.SetAllowance)
                                } else {
                                    setCurrentStep(Step.Purchase)
                                }
                            }}
                        />
                        <SetAllowance
                            visible={currentStep === Step.SetAllowance}
                            onConfirm={setAllowance}
                        />
                        <Complete
                            visible={currentStep === Step.Complete}
                            onConfirm={() => {
                                onClose()
                            }}
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
                            console.log('conf')

                            setCurrentStep(Step.Complete)
                        }}
                    />
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
