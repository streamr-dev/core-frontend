import { $Values } from 'utility-types'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import ProgressBar from '$shared/components/ProgressBar'
import { transactionStates, paymentCurrencies } from '$shared/utils/constants'
import { actionsTypes } from '$shared/hooks/usePurchase'
import { PaymentCurrency } from '$shared/types/common-types'
import routes from '$routes'
import PendingTasks from '../PendingTasks'
export type Status = Record<string, string>
export type Props = {
    status: Status
    onCancel: () => void
    prompt?: $Values<typeof actionsTypes>
    tokenSymbol: string
}
const PurchaseProgress = styled.div`
    width: 100%;
`
type PromptProps = {
    onCancel: () => void
}
const Helptext = styled.p`
    && {
        margin-bottom: 2rem;
    }
`

const ReplaceAllowancePrompt = ({ onCancel }: PromptProps) => (
    <ModalPortal>
        <Dialog
            onClose={onCancel}
            title="Set Marketplace Allowance"
            helpText={
                <Helptext>
                    You have an allowance set for the marketplace, but it is not enough to make the subscription. To fix
                    it, we need to make two transactions: First set allowance to zero, then continue normally by setting
                    it to the target value.
                    <br />
                    <a href={routes.resetAllowanceInfo()} target="_blank" rel="noopener noreferrer">
                        More information
                    </a>
                </Helptext>
            }
            actions={{
                cancel: {
                    title: 'Cancel',
                    kind: 'link',
                    disabled: true,
                },
                next: {
                    title: 'Waiting',
                    kind: 'primary',
                    disabled: true,
                    spinner: true,
                },
            }}
        >
            <p>Due to an issue with ERC-20 allowance, we need to reset your allowance before proceeding.</p>
        </Dialog>
    </ModalPortal>
)

type SetAllowancePromptProps = PromptProps & {
    paymentCurrency: PaymentCurrency
}

const SetAllowancePrompt = ({ onCancel, paymentCurrency }: SetAllowancePromptProps) => (
    <ModalPortal>
        <Dialog
            onClose={onCancel}
            title="Set Marketplace Allowance"
            helpText={
                <Helptext>
                    Allowance is a requirement of ERC-20 token transfers,
                    <br />
                    designed to increase security and efficiency.
                    <br />
                    For more about allowances, see this{' '}
                    <a href={routes.allowanceInfo()} target="_blank" rel="noopener noreferrer">
                        page
                    </a>
                    .
                </Helptext>
            }
            actions={{
                cancel: {
                    title: 'Cancel',
                    kind: 'link',
                    disabled: true,
                },
                next: {
                    title: 'Waiting',
                    kind: 'primary',
                    disabled: true,
                    spinner: true,
                },
            }}
        >
            <p>
                This step allows the marketplace to
                <br />
                transfer the required amount of {paymentCurrency}.
            </p>
        </Dialog>
    </ModalPortal>
)

const PurchasePrompt = ({ onCancel }: PromptProps) => (
    <ModalPortal>
        <Dialog
            onClose={onCancel}
            title="Subscription confirmation"
            actions={{
                cancel: {
                    title: 'Cancel',
                    kind: 'link',
                    disabled: true,
                },
                next: {
                    title: 'Waiting',
                    kind: 'primary',
                    disabled: true,
                    spinner: true,
                },
            }}
        >
            <div>
                <p>
                    You need to confirm the transaction
                    <br />
                    in your wallet to subscribe to this product.
                </p>
            </div>
        </Dialog>
    </ModalPortal>
)

const purchaseProgress = {
    setDaiAllowance: 'Setting allowance',
    resetDaiAllowance: 'Resetting allowance',
    setDataAllowance: 'Setting allowance',
    resetDataAllowance: 'Resetting allowance',
    subscription: 'Subscribing to the product',
}

const PurchaseTransactionProgress = ({ onCancel, status, prompt, tokenSymbol }: Props) => {
    const { pending, progress } = useMemo(
        () =>
            Object.keys(status).reduce(
                (result, key) => {
                    const value = status[key]

                    if (value === transactionStates.PENDING) {
                        return {
                            ...result,
                            pending: [...result.pending, key],
                            progress: result.progress + 1,
                        }
                    }

                    if (value === transactionStates.FAILED || value === transactionStates.CONFIRMED) {
                        return { ...result, progress: result.progress + 2 }
                    }

                    return result
                },
                {
                    pending: [],
                    progress: 0,
                },
            ),
        [status],
    )

    switch (prompt) {
        case actionsTypes.RESET_ALLOWANCE:
            return <ReplaceAllowancePrompt onCancel={onCancel} />

        case actionsTypes.SET_ALLOWANCE:
            return <SetAllowancePrompt onCancel={onCancel} paymentCurrency={tokenSymbol} />

        case actionsTypes.SUBSCRIPTION:
            return <PurchasePrompt onCancel={onCancel} />

        default:
            break
    }

    return (
        <ModalPortal>
            <Dialog
                onClose={onCancel}
                title="Subscribing to the product"
                actions={{
                    cancel: {
                        title: 'Cancel',
                        onClick: () => onCancel(),
                        kind: 'link',
                        disabled: true,
                    },
                    close: {
                        title: 'Working',
                        kind: 'primary',
                        disabled: true,
                        onClick: () => onCancel(),
                    },
                }}
            >
                <PurchaseProgress>
                    <PendingTasks>
                        {pending && pending.length > 0 && pending.map((key) => purchaseProgress[key]).join(', ')}
                    </PendingTasks>
                    <ProgressBar value={((progress + 1) / (Object.keys(status).length * 2 + 1)) * 100} />
                </PurchaseProgress>
            </Dialog>
        </ModalPortal>
    )
}

export default PurchaseTransactionProgress
