import moment from 'moment'
import React, { useState } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import { Abbr } from '~/components/Abbr'
import { Alert } from '~/components/Alert'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import {
    useConfigValueFromChain,
    useMaxUndelegationQueueDays,
    useMediaQuery,
} from '~/hooks'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import FormModal, {
    FieldWrap,
    FormModalProps,
    MaxButton,
    Prop,
    PropList,
    PropValue,
    Section,
    SectionHeadline,
    TextAppendix,
    TextInput,
} from '~/modals/FormModal'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { undelegateFromOperator } from '~/services/operators'
import Label from '~/shared/components/Ui/Label'
import { useWalletAccount } from '~/shared/stores/wallet'
import { waitForIndexedBlock } from '~/utils'
import { Layer } from '~/utils/Layer'
import { toBN, toBigInt, toFloat } from '~/utils/bn'
import {
    RejectionReason,
    isRejectionReason,
    isTransactionRejection,
} from '~/utils/exceptions'

interface Props extends Pick<FormModalProps, 'onReject'> {
    balance: bigint
    chainId: number
    delegatedTotal: bigint
    onResolve?: () => void
    operator: ParsedOperator
}

function UndelegateFundsModal({
    balance,
    chainId,
    delegatedTotal,
    onResolve,
    operator,
    ...props
}: Props) {
    const wallet = useWalletAccount()

    const isOwner = wallet?.toLowerCase() === operator.owner.toLowerCase()

    const [title, submitLabel, amountLabel, totalLabel, subtitlePartial] = isOwner
        ? [
              'Withdraw from Operator',
              'Withdraw',
              'Amount to unstake',
              'Amount currently staked on Operator',
              'you wish to unstake from your Operator',
          ]
        : [
              'Undelegate from Operator',
              'Undelegate',
              'Amount to undelegate',
              'Amount currently delegated to Operator',
              'to undelegate from the selected Operator',
          ]

    const [rawAmount, setRawAmount] = useState('')

    const maxUndelegationQueueDays = useMaxUndelegationQueueDays()

    const amount = toBigInt(rawAmount || 0)

    const { decimals = 18n } = useSponsorshipTokenInfo() || {}

    const freeFunds = operator.dataTokenBalanceWei

    const hasZeroDeployed = operator.totalStakeInSponsorshipsWei === 0n

    const minimumSelfDelegationFraction =
        useConfigValueFromChain('minimumSelfDelegationFraction', (value) =>
            toFloat(value, decimals),
        ) || toBN(0)

    const minimumSelfDelegationPercentage = minimumSelfDelegationFraction
        .multipliedBy(100)
        .toNumber()

    const isSelfDelegationTooLow =
        isOwner &&
        minimumSelfDelegationFraction.isGreaterThan(0) &&
        delegatedTotal - amount <
            toBigInt(toBN(delegatedTotal).multipliedBy(minimumSelfDelegationFraction))

    const earliestUndelegationTimestamp = operator.delegations.find(
        (d) => d.delegator.toLowerCase() === wallet?.toLowerCase(),
    )?.earliestUndelegationTimestamp

    const isTooEarlyToUndelegate =
        operator.contractVersion > 0 &&
        !isOwner &&
        earliestUndelegationTimestamp != null &&
        earliestUndelegationTimestamp * 1000 > Date.now()

    const canSubmit =
        amount > 0n &&
        !(isSelfDelegationTooLow && !hasZeroDeployed) &&
        !isTooEarlyToUndelegate

    const [busy, setBusy] = useState(false)

    const limitedSpace = useMediaQuery('screen and (max-width: 460px)')

    return (
        <FormModal
            {...props}
            title={title}
            canSubmit={canSubmit && !busy}
            submitting={busy}
            submitLabel={submitLabel}
            onBeforeAbort={(reason) =>
                !busy && (rawAmount === '' || reason !== RejectionReason.Backdrop)
            }
            onSubmit={async () => {
                setBusy(true)

                try {
                    await undelegateFromOperator(
                        chainId,
                        operator.id,
                        amount >= delegatedTotal ? Infinity : amount,
                        {
                            onBlockNumber: (blockNumber) =>
                                waitForIndexedBlock(chainId, blockNumber),
                        },
                    )

                    onResolve?.()
                } catch (e) {
                    if (isRejectionReason(e)) {
                        return
                    }

                    if (isTransactionRejection(e)) {
                        return
                    }

                    throw e
                } finally {
                    setBusy(false)
                }
            }}
        >
            <SectionHeadline>
                Please enter the amount of <SponsorshipPaymentTokenName /> tokens{' '}
                {subtitlePartial}
            </SectionHeadline>
            <Section>
                <Label $wrap>{amountLabel}</Label>
                <FieldWrap $top={true}>
                    <TextInput
                        name="amount"
                        autoFocus
                        onChange={({ target }) => {
                            setRawAmount(target.value)
                        }}
                        placeholder="0"
                        readOnly={busy}
                        type="number"
                        min={0}
                        step="any"
                        value={rawAmount}
                    />
                    <MaxButton
                        onClick={() => {
                            setRawAmount(toFloat(delegatedTotal, decimals).toString())
                        }}
                    />
                    <TextAppendix>
                        <SponsorshipPaymentTokenName />
                    </TextAppendix>
                </FieldWrap>
                <FieldWrap $bottom $padded>
                    <Prop>
                        {totalLabel}:{' '}
                        {limitedSpace ? (
                            <Abbr>{toFloat(delegatedTotal, decimals)}</Abbr>
                        ) : (
                            <>
                                {toFloat(delegatedTotal, decimals).toString()}{' '}
                                <SponsorshipPaymentTokenName />
                            </>
                        )}
                    </Prop>
                </FieldWrap>
                <PropList>
                    <li>
                        <Prop>Your wallet balance</Prop>
                        <PropValue>
                            {limitedSpace ? (
                                <Abbr>{toFloat(balance, decimals)}</Abbr>
                            ) : (
                                <>
                                    {toFloat(balance, decimals).toString()}{' '}
                                    <SponsorshipPaymentTokenName />
                                </>
                            )}
                        </PropValue>
                    </li>
                    <li>
                        <Prop>Operator</Prop>
                        <PropValue>{operator.id}</PropValue>
                    </li>
                    <li>
                        <Prop>Available balance in Operator</Prop>
                        <PropValue>
                            {limitedSpace ? (
                                <Abbr>{toFloat(freeFunds, decimals)}</Abbr>
                            ) : (
                                <>
                                    {toFloat(freeFunds, decimals).toString()}{' '}
                                    <SponsorshipPaymentTokenName />
                                </>
                            )}
                        </PropValue>
                    </li>
                </PropList>
            </Section>
            <Footer>
                {amount > 0 && amount <= freeFunds && (
                    <Alert
                        type="notice"
                        title={
                            <>
                                {toFloat(amount, decimals).toString()}{' '}
                                <SponsorshipPaymentTokenName /> will be undelegated
                                immediately
                            </>
                        }
                    />
                )}
                {amount > freeFunds && (
                    <Alert type="notice" title="Undelegation will be queued">
                        Your undelegation will be queued for a maximum of{' '}
                        {maxUndelegationQueueDays.toString()} days, after which you will
                        be able to force undelegation.
                    </Alert>
                )}
                {isSelfDelegationTooLow && hasZeroDeployed && (
                    <Alert type="error" title="Low self-funding">
                        At least {minimumSelfDelegationPercentage.toFixed(0)}% of the
                        Operator&apos;s total stake must come from you as the owner. After
                        your withdrawal, your remaining amount will be below this limit.
                        This will prevent your Operator from staking on Sponsorships. It
                        will also signal to Delegators that you&apos;re shutting down, and
                        will most likely cause them to undelegate.
                    </Alert>
                )}
                {isSelfDelegationTooLow && !hasZeroDeployed && (
                    <Alert type="error" title="Low self-funding">
                        At least {minimumSelfDelegationPercentage.toFixed(0)}% of the
                        Operator&apos;s total stake must come from you as the owner. If
                        you wish to stop being an Operator, you can withdraw any amount
                        once your Operator is not staked on any Sponsorships. Note that
                        this prevents your Operator from staking on Sponsorships until the
                        limit is reached again. It is also a strong signal to Delegators
                        that you&apos;re shutting down, and will most likely cause them to
                        undelegate.
                    </Alert>
                )}
                {isTooEarlyToUndelegate && (
                    <Alert
                        type="error"
                        title={`You can not undelegate because your minimum delegation period
                        is still active. It will expire on ${moment(
                            earliestUndelegationTimestamp * 1000,
                        ).format('YYYY-MM-DD HH:mm')}.`}
                    />
                )}
            </Footer>
        </FormModal>
    )
}

const Footer = styled.div`
    display: grid;
    gap: 8px;
    margin-top: 8px;
`

export const undelegateFundsModal = toaster(UndelegateFundsModal, Layer.Modal)
