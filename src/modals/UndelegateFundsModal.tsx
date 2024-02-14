import React, { useState } from 'react'
import styled from 'styled-components'
import { Alert } from '~/components/Alert'
import {
    RejectionReason,
    isRejectionReason,
    isTransactionRejection,
} from '~/utils/exceptions'
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
import Label from '~/shared/components/Ui/Label'
import { BN, toBN } from '~/utils/bn'
import { fromDecimals, toDecimals } from '~/marketplace/utils/math'
import {
    useConfigValueFromChain,
    useMaxUndelegationQueueDays,
    useMediaQuery,
} from '~/hooks'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import { useWalletAccount } from '~/shared/stores/wallet'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { undelegateFromOperator } from '~/services/operators'
import { waitForIndexedBlock } from '~/utils'
import { Abbr } from '~/components/Abbr'

interface Props extends Pick<FormModalProps, 'onReject'> {
    balance: BN
    chainId: number
    delegatedTotal: BN
    onResolve?: () => void
    operator: ParsedOperator
}

export default function UndelegateFundsModal({
    balance,
    chainId,
    delegatedTotal: delegatedTotalProp,
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

    const value = rawAmount || '0'

    const finalValue = toBN(value)

    const { decimals = 18 } = useSponsorshipTokenInfo() || {}

    const delegatedTotal = fromDecimals(delegatedTotalProp, decimals)

    const freeFunds = fromDecimals(operator.dataTokenBalanceWei, decimals)

    const hasZeroDeployed = operator.totalStakeInSponsorshipsWei.isZero()

    const minimumSelfDelegationFraction = useConfigValueFromChain(
        'minimumSelfDelegationFraction',
    )

    const minimumSelfDelegationPercentage =
        minimumSelfDelegationFraction != null
            ? fromDecimals(minimumSelfDelegationFraction, decimals)
            : toBN(0)

    const isSelfDelegationTooLow =
        minimumSelfDelegationPercentage != null &&
        isOwner &&
        minimumSelfDelegationPercentage.isGreaterThan(0) &&
        delegatedTotal
            .minus(toBN(rawAmount))
            .isLessThan(minimumSelfDelegationPercentage.multipliedBy(delegatedTotal))

    const canSubmit =
        finalValue.isFinite() &&
        finalValue.isGreaterThan(0) &&
        !(isSelfDelegationTooLow && !hasZeroDeployed)

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

                const prefinalAmount = toDecimals(finalValue, decimals)

                try {
                    await undelegateFromOperator(
                        chainId,
                        operator.id,
                        prefinalAmount.isGreaterThanOrEqualTo(delegatedTotalProp)
                            ? toBN(Number.POSITIVE_INFINITY)
                            : prefinalAmount,
                        {
                            onBlockNumber: (blockNumber) => {
                                waitForIndexedBlock(chainId, blockNumber)
                            },
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
                        onChange={({ target }) => void setRawAmount(target.value)}
                        placeholder="0"
                        readOnly={busy}
                        type="number"
                        min={0}
                        step="any"
                        value={rawAmount}
                    />
                    <MaxButton
                        onClick={() => {
                            setRawAmount(delegatedTotal.toString())
                        }}
                    />
                    <TextAppendix>
                        <SponsorshipPaymentTokenName />
                    </TextAppendix>
                </FieldWrap>
                <FieldWrap $bottom={true} $padded={true}>
                    <Prop>
                        {totalLabel}:{' '}
                        {limitedSpace ? (
                            <Abbr>{delegatedTotal}</Abbr>
                        ) : (
                            <>
                                {delegatedTotal.toString()}{' '}
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
                                <Abbr>{balance}</Abbr>
                            ) : (
                                <>
                                    {balance.toString()} <SponsorshipPaymentTokenName />
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
                                <Abbr>{freeFunds}</Abbr>
                            ) : (
                                <>
                                    {freeFunds.toString()} <SponsorshipPaymentTokenName />
                                </>
                            )}
                        </PropValue>
                    </li>
                </PropList>
            </Section>
            <Footer>
                {toBN(rawAmount).isGreaterThan(0) &&
                    toBN(rawAmount).isLessThanOrEqualTo(freeFunds) && (
                        <Alert
                            type="notice"
                            title={
                                <>
                                    {rawAmount.toString()} <SponsorshipPaymentTokenName />{' '}
                                    will be undelegated immediately
                                </>
                            }
                        />
                    )}
                {toBN(rawAmount).isGreaterThan(freeFunds) && (
                    <Alert type="notice" title="Undelegation will be queued">
                        Your undelegation will be queued for a maximum of{' '}
                        {maxUndelegationQueueDays.toNumber().toFixed(0)} days, after which
                        you will be able to force undelegation.
                    </Alert>
                )}
                {isSelfDelegationTooLow && hasZeroDeployed && (
                    <Alert type="error" title="Low self-funding">
                        At least{' '}
                        {minimumSelfDelegationPercentage.multipliedBy(100).toFixed(0)}% of
                        the Operator&apos;s total stake must come from you as the owner.
                        After your withdrawal, your remaining amount will be below this
                        limit. This will prevent your Operator from staking on
                        Sponsorships. It will also signal to Delegators that you&apos;re
                        shutting down, and will most likely cause them to undelegate.
                    </Alert>
                )}
                {isSelfDelegationTooLow && !hasZeroDeployed && (
                    <Alert type="error" title="Low self-funding">
                        At least{' '}
                        {minimumSelfDelegationPercentage.multipliedBy(100).toFixed(0)}% of
                        the Operator&apos;s total stake must come from you as the owner.
                        If you wish to stop being an Operator, you can withdraw any amount
                        once your Operator is not staked on any Sponsorships. Note that
                        this prevents your Operator from staking on Sponsorships until the
                        limit is reached again. It is also a strong signal to Delegators
                        that you&apos;re shutting down, and will most likely cause them to
                        undelegate.
                    </Alert>
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
