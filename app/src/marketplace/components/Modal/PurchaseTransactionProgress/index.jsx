// @flow

import React, { useMemo } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import ProgressBar from '$shared/components/ProgressBar'
import { transactionStates, paymentCurrencies } from '$shared/utils/constants'
import { actionsTypes } from '$mp/containers/ProductPage/usePurchase'
import type { PaymentCurrency } from '$shared/flowtype/common-types'
import routes from '$routes'

export type Status = {
    [string]: string,
}

export type Props = {
    status: Status,
    onCancel: () => void,
    prompt?: $Values<typeof actionsTypes>,
}

const PublishProgress = styled.div`
    width: 100%;
`

const PendingTasks = styled.div`
    color: '#A3A3A3';
    font-size: 1rem;
    line-height: 1.5rem;
    width: 100%;
    min-height: 1.5rem;
    margin-bottom: 0.5rem;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:not(:empty)::after {
        content: '...';
    }
`

type PromptProps = {
    onCancel: () => void,
}

const StyledHelpTextTranslate = styled(Translate)`
    && {
        margin-bottom: 2rem;
    }
`

const ReplaceAllowancePrompt = ({ onCancel }: PromptProps) => (
    <ModalPortal>
        <Dialog
            onClose={onCancel}
            title={I18n.t('modal.setAllowance.title')}
            helpText={(
                <StyledHelpTextTranslate
                    value="modal.replaceAllowance.helpText"
                    resetAllowanceLink={routes.resetAllowanceInfo()}
                    dangerousHTML
                    tag="p"
                />
            )}
            actions={{
                cancel: {
                    title: I18n.t('modal.common.cancel'),
                    kind: 'link',
                    disabled: true,
                },
                next: {
                    title: I18n.t('modal.common.waiting'),
                    kind: 'primary',
                    disabled: true,
                    spinner: true,
                },
            }}
        >
            <Translate value="modal.replaceAllowance.message" dangerousHTML tag="p" />
        </Dialog>
    </ModalPortal>
)

type SetAllowancePromptProps = PromptProps & {
    paymentCurrency: PaymentCurrency,
}

const SetAllowancePrompt = ({ onCancel, paymentCurrency }: SetAllowancePromptProps) => (
    <ModalPortal>
        <Dialog
            onClose={onCancel}
            title={I18n.t('modal.setAllowance.title')}
            helpText={(
                <StyledHelpTextTranslate
                    value="modal.setAllowance.helpText"
                    allowanceLink={routes.allowanceInfo()}
                    dangerousHTML
                />
            )}
            actions={{
                cancel: {
                    title: I18n.t('modal.common.cancel'),
                    kind: 'link',
                    disabled: true,
                },
                next: {
                    title: I18n.t('modal.common.waiting'),
                    kind: 'primary',
                    disabled: true,
                    spinner: true,
                },
            }}
        >
            <Translate
                value="modal.setAllowance.description"
                currency={paymentCurrency}
                dangerousHTML
                tag="p"
            />
        </Dialog>
    </ModalPortal>
)

const PurchasePrompt = ({ onCancel }: PromptProps) => (
    <ModalPortal>
        <Dialog
            onClose={onCancel}
            title={I18n.t('modal.purchaseSummary.started.title')}
            actions={{
                cancel: {
                    title: I18n.t('modal.common.cancel'),
                    kind: 'link',
                    disabled: true,
                },
                publish: {
                    title: I18n.t('modal.common.waiting'),
                    kind: 'primary',
                    disabled: true,
                    spinner: true,
                },
            }}
        >
            <div>
                <Translate value="modal.purchaseSummary.started.message" dangerousHTML tag="p" />
            </div>
        </Dialog>
    </ModalPortal>
)

const PurchaseTransactionProgress = ({ onCancel, status, prompt }: Props) => {
    const { pending, complete } = useMemo(() => Object.keys(status).reduce((result, key) => {
        const value = status[key]

        if (value === transactionStates.PENDING) {
            result.pending.push(key)
        }

        if (value === transactionStates.FAILED || value === transactionStates.CONFIRMED) {
            result.complete.push(key)
        }

        return result
    }, {
        pending: [],
        complete: [],
    }), [status])

    switch (prompt) {
        case actionsTypes.RESET_DATA_ALLOWANCE:
        case actionsTypes.RESET_DAI_ALLOWANCE:
            return (
                <ReplaceAllowancePrompt onCancel={onCancel} />
            )

        case actionsTypes.SET_DATA_ALLOWANCE:
            return (
                <SetAllowancePrompt
                    onCancel={onCancel}
                    paymentCurrency={paymentCurrencies.DATA}
                />
            )

        case actionsTypes.PURCHASE:
            return (
                <PurchasePrompt onCancel={onCancel} />
            )

        case actionsTypes.SET_DAI_ALLOWANCE:
            return (
                <SetAllowancePrompt
                    onCancel={onCancel}
                    paymentCurrency={paymentCurrencies.DAI}
                />
            )

        default:
            break
    }

    return (
        <ModalPortal>
            <Dialog
                onClose={onCancel}
                title={I18n.t('modal.purchaseProgress.title')}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        onClick: () => onCancel(),
                        kind: 'link',
                        disabled: true,
                    },
                    close: {
                        title: I18n.t('modal.common.working'),
                        kind: 'primary',
                        disabled: true,
                        onClick: () => onCancel(),
                    },
                }}
            >
                <PublishProgress>
                    <PendingTasks>
                        {pending && pending.length > 0 && pending.map((key) => (
                            I18n.t(`modal.purchaseProgress.${key}.pending`)
                        )).join(', ')}
                    </PendingTasks>
                    <ProgressBar value={(complete.length / Math.max(1, Object.keys(status).length)) * 100} />
                </PublishProgress>
            </Dialog>
        </ModalPortal>
    )
}

export default PurchaseTransactionProgress
