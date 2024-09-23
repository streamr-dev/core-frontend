import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Alert as PrestyledAlert } from '~/components/Alert'
import { SponsorshipDecimals } from '~/components/Decimals'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { getSelfDelegatedAmount, getSelfDelegationFraction } from '~/getters'
import { useConfigValueFromChain, useMediaQuery } from '~/hooks'
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
import { Operator } from '~/parsers/Operator'
import { delegateToOperator } from '~/services/operators'
import Label from '~/shared/components/Ui/Label'
import { useWalletAccount } from '~/shared/stores/wallet'
import { humanize } from '~/shared/utils/time'
import { waitForIndexedBlock } from '~/utils'
import { toBN, toBigInt, toFloat } from '~/utils/bn'
import {
    RejectionReason,
    isRejectionReason,
    isTransactionRejection,
} from '~/utils/exceptions'

interface Props extends Pick<FormModalProps, 'onReject'> {
    amount?: string
    balance: bigint
    chainId: number
    delegatedTotal: bigint
    onResolve?: () => void
    operator: Operator
}

export default function DelegateFundsModal({
    balance,
    chainId,
    delegatedTotal,
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

    const minimumDelegationWei = useConfigValueFromChain('minimumDelegationWei') || 0n

    const minimumSelfDelegationFraction =
        useConfigValueFromChain('minimumSelfDelegationFraction', (value) =>
            toFloat(value, 18n),
        ) || toBN(0)

    const minimumDelegationSeconds =
        useConfigValueFromChain('minimumDelegationSeconds', (value) =>
            !isOwner ? Number(value) : 0,
        ) || 0

    const [rawAmount, setRawAmount] = useState('')

    const { decimals = 18n } = useSponsorshipTokenInfo() || {}

    const value = toBigInt(rawAmount || 0, decimals)

    const insufficientFunds = value > balance

    const selfDelegationFraction = useMemo(
        () => getSelfDelegationFraction(operator),
        [operator],
    )

    const nextSelfDelegationFraction = useMemo(
        () => getSelfDelegationFraction(operator, { offset: value }),
        [operator, value],
    )

    const tooLowCurrentSelfDelegation =
        !isOwner &&
        selfDelegationFraction.isLessThanOrEqualTo(minimumSelfDelegationFraction)

    const tooLowNextSelfDelegation =
        !isOwner &&
        nextSelfDelegationFraction.isLessThanOrEqualTo(minimumSelfDelegationFraction)

    const tooLowOwnerSelfDelegation =
        tooLowCurrentSelfDelegation || tooLowNextSelfDelegation

    const maxNextAmount = useMemo(() => {
        if (minimumSelfDelegationFraction.isEqualTo(0)) {
            return 0n
        }

        const operatorSelfStake = getSelfDelegatedAmount(operator)

        return (
            toBigInt(toBN(operatorSelfStake).dividedBy(minimumSelfDelegationFraction)) -
            delegatedTotal -
            operatorSelfStake
        )
    }, [minimumSelfDelegationFraction, operator, delegatedTotal])

    const canSubmit =
        value > 0n &&
        value >= minimumDelegationWei &&
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
                !busy && (rawAmount === '' || reason !== RejectionReason.Backdrop)
            }
            onSubmit={async () => {
                if (!canSubmit) {
                    return
                }

                setBusy(true)

                try {
                    await delegateToOperator(chainId, operator.id, value, {
                        onReceipt: ({ blockNumber }) =>
                            waitForIndexedBlock(chainId, blockNumber),
                    })

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
                            setRawAmount(toFloat(balance, decimals).toString())
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
                            <SponsorshipDecimals
                                abbr={limitedSpace}
                                amount={balance}
                                tooltip={limitedSpace}
                            />
                        </PropValue>
                    </li>
                    <li>
                        <Prop>Operator</Prop>
                        <PropValue>{operator.id}</PropValue>
                    </li>
                    <li>
                        <Prop>{totalLabel}</Prop>
                        <PropValue>
                            <SponsorshipDecimals
                                abbr={limitedSpace}
                                amount={delegatedTotal}
                                tooltip={limitedSpace}
                            />
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
                        {tooLowNextSelfDelegation && (
                            <Alert type="error" title="Amount too high">
                                This operator can currently only accept less than{' '}
                                <strong>
                                    <SponsorshipDecimals amount={maxNextAmount} />
                                </strong>{' '}
                                in further delegations, because operators must stay above
                                a certain proportion of their own funds vs. delegations.
                            </Alert>
                        )}
                    </>
                )}
            </>
            <>
                {value > 0n && value < minimumDelegationWei && (
                    <Alert
                        type="notice"
                        title={
                            <>
                                Minimum delegation is{' '}
                                <SponsorshipDecimals amount={minimumDelegationWei} />
                            </>
                        }
                    ></Alert>
                )}
            </>
            <>
                {operator.contractVersion > 0 && minimumDelegationSeconds > 0 && (
                    <Alert
                        type="notice"
                        title={`You will need to stay delegated for at least ${humanize(
                            minimumDelegationSeconds,
                        )}.`}
                    ></Alert>
                )}
            </>
            <>
                {operator.contractVersion < 3 && !isOwner && (
                    <Alert type="error" title="Slashing risk">
                        This Operator is running an older version of the Operator smart
                        contract where Delegators are subject to slashing risk if the
                        Operator is voted out of a Sponsorship. In newer Operator
                        versions, Delegators are more protected from slashing.
                    </Alert>
                )}
            </>
        </FormModal>
    )
}

const Alert = styled(PrestyledAlert)`
    margin-top: 10px;
`
