import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import CopyIcon from '@atlaskit/icon/glyph/copy'
import { RejectionReason } from '~/modals/BaseModal'
import FormModal, {
    CopyButtonWrapAppendix,
    ErrorLabel,
    FieldWrap,
    FormModalProps,
    Prop,
    Section,
    SectionHeadline,
    TextAppendix,
    TextInput,
    WingedLabelWrap,
} from '~/modals/FormModal'
import Label from '~/shared/components/Ui/Label'
import useCopy from '~/shared/hooks/useCopy'
import { toBN } from '~/utils/bn'
import { Alert } from '~/components/Alert'
import SvgIcon from '~/shared/components/SvgIcon'
import { COLORS } from '~/shared/utils/styled'
import useOperatorLiveNodes from '~/hooks/useOperatorLiveNodes'
import { fromDecimals, toDecimals } from '~/marketplace/utils/math'
import { useConfigValueFromChain } from '~/hooks'
import { useInterceptHeartbeats } from '~/hooks/useInterceptHeartbeats'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import { stakeOnSponsorship } from '~/services/sponsorships'
import { isMessagedObject } from '~/utils'
import { errorToast } from '~/utils/toast'
import Toast from '~/shared/toasts/Toast'
import { Layer } from '~/utils/Layer'
import { getSelfDelegationFraction } from '~/getters'

interface Props extends Pick<FormModalProps, 'onReject'> {
    amount?: string
    onResolve?: () => void
    operator: ParsedOperator
    sponsorship: ParsedSponsorship
}

function parseAmount(amount: string | undefined, decimals: number) {
    return !amount || amount === '0' ? '' : fromDecimals(amount, decimals).toString()
}

const limitErrorToaster = toaster(Toast, Layer.Toast)

export default function JoinSponsorshipModal({
    amount: amountProp = '0',
    onResolve,
    operator,
    sponsorship,
    ...props
}: Props) {
    const { decimals = 18, symbol: tokenSymbol = 'DATA' } =
        useSponsorshipTokenInfo() || {}

    const { id: operatorId, dataTokenBalanceWei: operatorBalance } = operator

    const hasUndelegationQueue = operator.queueEntries.length > 0

    const { streamId } = sponsorship

    const [busy, setBusy] = useState(false)

    const [rawAmount, setRawAmount] = useState(parseAmount(amountProp, decimals))

    const amount = toDecimals(rawAmount || '0', decimals)

    const finalAmount = amount.isFinite() && amount.isGreaterThan(0) ? amount : toBN(0)

    const heartbeats = useInterceptHeartbeats(operatorId)

    const { count: liveNodesCount, isLoading: liveNodesCountLoading } =
        useOperatorLiveNodes(heartbeats)

    useEffect(() => {
        setRawAmount(parseAmount(amountProp, decimals))
    }, [amountProp, decimals])

    const insufficientFunds = finalAmount.isGreaterThan(operatorBalance)

    const minimumSelfDelegationFraction = useConfigValueFromChain(
        'minimumSelfDelegationFraction',
    )

    const minimumSelfDelegationPercentage =
        minimumSelfDelegationFraction != null
            ? fromDecimals(minimumSelfDelegationFraction, decimals)
            : toBN(0)

    const minimumSelfDelegationAmount = fromDecimals(
        operator.valueWithoutEarnings,
        decimals,
    ).multipliedBy(minimumSelfDelegationPercentage)

    const ownerDelegationPercentage = useMemo(() => {
        return getSelfDelegationFraction(operator)
    }, [operator])

    const currentSelfDelegationAmount = fromDecimals(
        operator.valueWithoutEarnings,
        decimals,
    ).multipliedBy(ownerDelegationPercentage)

    const isBelowSelfFundingLimit = ownerDelegationPercentage.isLessThan(
        minimumSelfDelegationPercentage,
    )

    const minimumStakingDays = sponsorship.minimumStakingPeriodSeconds / (60 * 60 * 24)

    const minimumStakeWei = useConfigValueFromChain('minimumStakeWei')

    const isAboveMinimumStake = minimumStakeWei
        ? finalAmount.isGreaterThanOrEqualTo(toBN(minimumStakeWei))
        : true

    const canSubmit =
        finalAmount.isGreaterThan(0) &&
        !insufficientFunds &&
        !liveNodesCountLoading &&
        liveNodesCount > 0 &&
        isAboveMinimumStake &&
        !hasUndelegationQueue &&
        !isBelowSelfFundingLimit

    const { copy } = useCopy()

    return (
        <FormModal
            {...props}
            title="Join Sponsorship as Operator"
            canSubmit={canSubmit && !busy}
            submitLabel="Join"
            submitting={busy}
            onBeforeAbort={(reason) =>
                !busy &&
                (toBN(rawAmount || '0')
                    .multipliedBy(Math.pow(10, decimals))
                    .eq(amountProp || '0') ||
                    reason !== RejectionReason.Backdrop)
            }
            onSubmit={async () => {
                if (!canSubmit) {
                    return
                }

                setBusy(true)

                try {
                    await stakeOnSponsorship(
                        sponsorship.id,
                        finalAmount.toString(),
                        operator.id,
                    )

                    onResolve?.()
                } catch (e) {
                    if (isMessagedObject(e) && /error_tooManyOperators/.test(e.message)) {
                        return void errorToast(
                            {
                                title: 'Limit reached',
                                desc: 'All operator slots are taken.',
                            },
                            limitErrorToaster,
                        )
                    }

                    throw e
                } finally {
                    setBusy(false)
                }
            }}
        >
            <SectionHeadline>
                Please set the amount of {tokenSymbol} to stake on the selected
                Sponsorship
            </SectionHeadline>
            <Section>
                <Label>Sponsorship Stream ID</Label>
                <FieldWrap $grayedOut>
                    <TextInput defaultValue={streamId} readOnly />
                    {!!streamId && (
                        <CopyButtonWrapAppendix>
                            <button type="button" onClick={() => void copy(streamId)}>
                                <CopyIcon label="Copy" size="small" />
                            </button>
                        </CopyButtonWrapAppendix>
                    )}
                </FieldWrap>
                <StyledLabelWrap>
                    <Label>Amount to stake</Label>
                    {rawAmount !== '' && !isAboveMinimumStake && (
                        <ErrorLabel>
                            Minimum value is{' '}
                            {fromDecimals(minimumStakeWei || 0, decimals).toString()}{' '}
                            {tokenSymbol}
                        </ErrorLabel>
                    )}
                </StyledLabelWrap>
                <FieldWrap $invalid={rawAmount !== '' && !isAboveMinimumStake}>
                    <TextInput
                        autoFocus
                        name="amount"
                        onChange={({ target }) => void setRawAmount(target.value)}
                        placeholder="0"
                        readOnly={busy}
                        type="number"
                        min={0}
                        step="any"
                        value={rawAmount}
                    />
                    <TextAppendix>{tokenSymbol}</TextAppendix>
                </FieldWrap>
                <ul>
                    <li>
                        <Prop>Minimum stake duration</Prop>
                        <div>
                            {minimumStakingDays.toFixed(0)} day
                            {minimumStakingDays !== 1 && 's'}
                        </div>
                    </li>
                    <li>
                        <Prop $invalid={insufficientFunds}>
                            {insufficientFunds ? (
                                <>Not enough balance in Operator</>
                            ) : (
                                <>Available balance in Operator</>
                            )}
                        </Prop>
                        <div>
                            {fromDecimals(operatorBalance, decimals).toString()}{' '}
                            {tokenSymbol}
                        </div>
                    </li>
                    <li>
                        <Prop>Operator</Prop>
                        <div>{operatorId}</div>
                    </li>
                </ul>
            </Section>
            {isBelowSelfFundingLimit && (
                <StyledAlert type="error" title="Low self-funding">
                    You cannot stake on Sponsorships because your Operator is below the
                    self-funding requirement of{' '}
                    {minimumSelfDelegationPercentage.multipliedBy(100).toFixed(0)}%.
                    Increase your Operator stake by at least{' '}
                    {minimumSelfDelegationAmount
                        .minus(currentSelfDelegationAmount)
                        .toString()}{' '}
                    {tokenSymbol} to continue.
                </StyledAlert>
            )}
            {hasUndelegationQueue && (
                <StyledAlert type="error" title="Warning!">
                    Cannot stake on sponsorship while delegators are awaiting undelegation
                </StyledAlert>
            )}
            {!isBelowSelfFundingLimit && !hasUndelegationQueue && (
                <LiveNodesCheck
                    liveNodesCountLoading={liveNodesCountLoading}
                    liveNodesCount={liveNodesCount}
                />
            )}
        </FormModal>
    )
}

const LiveNodesCheck: FunctionComponent<{
    liveNodesCountLoading: boolean
    liveNodesCount: number
}> = ({ liveNodesCount, liveNodesCountLoading }) => {
    return (
        <>
            {liveNodesCountLoading && (
                <StyledAlert type="loading" title="Checking Streamr nodes">
                    <span>
                        In order to continue, you need to have one or more Streamr nodes
                        running and correctly configured. You will be slashed if you stake
                        without your nodes contributing resources to the stream.
                    </span>
                </StyledAlert>
            )}
            {!liveNodesCountLoading &&
                (liveNodesCount > 0 ? (
                    <StyledAlert type="success" title="Streamr nodes detected">
                        <span>
                            Once you stake, your nodes will start working on the stream.
                            Please ensure your nodes have enough resources available to
                            handle the traffic in the stream.
                        </span>
                    </StyledAlert>
                ) : (
                    <StyledAlert type="error" title="Streamr nodes not detected">
                        <p>
                            In order to continue, you need to have one or more Streamr
                            nodes running and correctly configured. You will be slashed if
                            you stake without your nodes contributing resources to the
                            stream.
                        </p>
                        <a
                            href="https://docs.streamr.network/node-runners/run-a-node"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            How to run a Streamr node <LinkIcon name="externalLink" />
                        </a>
                    </StyledAlert>
                ))}
        </>
    )
}

const StyledAlert = styled(Alert)`
    margin-top: 16px;

    a {
        color: ${COLORS.link};
        display: flex;
        align-items: center;
    }
`

const LinkIcon = styled(SvgIcon)`
    width: 24px;
`

const StyledLabelWrap = styled(WingedLabelWrap)`
    margin-top: 10px;
`
