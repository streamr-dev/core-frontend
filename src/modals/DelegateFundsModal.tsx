import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
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
import { Alert as PrestyledAlert } from '~/components/Alert'
import { useWalletAccount } from '~/shared/stores/wallet'
import { getSelfDelegatedAmount, getSelfDelegationFraction } from '~/getters'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { useConfigValueFromChain, useMediaQuery } from '~/hooks'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import { delegateToOperator } from '~/services/operators'
import { waitForIndexedBlock } from '~/utils'
import { Abbr } from '~/components/Abbr'

interface Props extends Pick<FormModalProps, 'onReject'> {
    amount?: string
    balance: BN
    chainId: number
    delegatedTotal: BN
    onResolve?: () => void
    operator: ParsedOperator
}

export default function DelegateFundsModal({
    amount: amountProp = '',
    balance,
    chainId,
    delegatedTotal: delegatedTotalProp,
    onResolve,
    operator,
    ...props
}: Props) {
    const walletAddress = useWalletAccount()

    const isOwner = walletAddress?.toLowerCase() === operator.owner.toLowerCase()

    const [submitLabel, title, amountLabel, totalLabel, subtitlePartial] = isOwner
        ? [
              'Fund',
              'Fund Operator',
              'Amount to stake',
              'Your stake',
              'you wish to stake on your Operator',
          ]
        : [
              'Delegate',
              'Delegate to Operator',
              'Amount to delegate',
              'Your delegation',
              'to delegate to the selected Operator',
          ]

    const minimumSelfDelegationFraction = useConfigValueFromChain(
        'minimumSelfDelegationFraction',
    )
    const minimumSelfDelegation = minimumSelfDelegationFraction
        ? fromDecimals(minimumSelfDelegationFraction, 18)
        : toBN(0)

    const minimumDelegationSecondsValue = useConfigValueFromChain(
        'minimumDelegationSeconds',
    )
    const minimumDelegationSeconds = minimumDelegationSecondsValue
        ? toBN(minimumDelegationSecondsValue)
        : toBN(0)

    const [rawAmount, setRawAmount] = useState(amountProp)

    useEffect(() => {
        setRawAmount(amountProp)
    }, [amountProp])

    const value = rawAmount || '0'

    const finalValue = toBN(value)

    const { decimals = 18 } = useSponsorshipTokenInfo() || {}

    const delegatedTotal = fromDecimals(delegatedTotalProp, decimals)

    const finalValueDecimals = toDecimals(finalValue, decimals)

    const insufficientFunds = finalValue.isGreaterThan(balance)

    const tooLowCurrentSelfDelegation = useMemo(() => {
        return (
            !isOwner &&
            getSelfDelegationFraction(operator).isLessThanOrEqualTo(minimumSelfDelegation)
        )
    }, [operator, minimumSelfDelegation, isOwner])

    const tooLowSelfDelegationWithNewAmount = useMemo(() => {
        return (
            !isOwner &&
            getSelfDelegationFraction(operator, {
                offset: finalValueDecimals,
            }).isLessThanOrEqualTo(minimumSelfDelegation)
        )
    }, [operator, minimumSelfDelegation, finalValueDecimals, isOwner])

    const tooLowOwnerSelfDelegation =
        tooLowCurrentSelfDelegation || tooLowSelfDelegationWithNewAmount

    const maxAmount = useMemo<BN>(() => {
        if (minimumSelfDelegation.isZero()) {
            return toBN(0)
        }
        const operatorSelfStake = getSelfDelegatedAmount(operator)
        return fromDecimals(
            operatorSelfStake.dividedBy(minimumSelfDelegation).minus(operatorSelfStake),
            decimals,
        ).minus(delegatedTotal)
    }, [operator, minimumSelfDelegation, decimals, delegatedTotal])

    const canSubmit =
        finalValue.isFinite() &&
        finalValue.isGreaterThan(0) &&
        !insufficientFunds &&
        !tooLowOwnerSelfDelegation

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
                !busy && (rawAmount === amountProp || reason !== RejectionReason.Backdrop)
            }
            onSubmit={async () => {
                if (!canSubmit) {
                    return
                }

                setBusy(true)

                try {
                    await delegateToOperator(
                        chainId,
                        operator.id,
                        toDecimals(finalValue, decimals),
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
                <Label>{amountLabel}</Label>
                <FieldWrap $invalid={insufficientFunds}>
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
                            setRawAmount(balance.toString())
                        }}
                    />
                    <TextAppendix>
                        <SponsorshipPaymentTokenName />
                    </TextAppendix>
                </FieldWrap>
                <PropList>
                    <li>
                        <Prop $invalid={insufficientFunds}>
                            {insufficientFunds ? (
                                <>Not enough balance in your wallet</>
                            ) : (
                                <>Your wallet balance</>
                            )}
                        </Prop>
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
                        <Prop>{totalLabel}</Prop>
                        <PropValue>
                            {limitedSpace ? (
                                <Abbr>{delegatedTotal}</Abbr>
                            ) : (
                                <>
                                    {delegatedTotal.toString()}{' '}
                                    <SponsorshipPaymentTokenName />
                                </>
                            )}
                        </PropValue>
                    </li>
                </PropList>
            </Section>
            <>
                {tooLowCurrentSelfDelegation ? (
                    <Alert type="error" title="Unable to delegate">
                        This operator can not accept any further delegations at the
                        moment, because the operator&apos;s own share of funds is below
                        the required limit.
                    </Alert>
                ) : (
                    <>
                        {tooLowSelfDelegationWithNewAmount && (
                            <Alert type="error" title="Amount too high">
                                This operator can currently only accept less than{' '}
                                <strong>
                                    {maxAmount.toString()} <SponsorshipPaymentTokenName />
                                </strong>{' '}
                                in further delegations, because operators must stay above
                                a certain proportion of their own funds vs. delegations.
                            </Alert>
                        )}
                    </>
                )}
            </>
            <>
                {operator.contractVersion > 0 &&
                    minimumDelegationSeconds.isGreaterThan(0) && (
                        <Alert
                            type="notice"
                            title={`You will need to stay delegated for at least ${minimumDelegationSeconds
                                .dividedBy(60 * 60 * 24)
                                .toFixed()} days.`}
                        ></Alert>
                    )}
            </>
        </FormModal>
    )
}

const Alert = styled(PrestyledAlert)`
    margin-top: 10px;
`
