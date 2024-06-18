import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import CopyIcon from '@atlaskit/icon/glyph/copy'
import { RejectionReason, isMessagedObject } from '~/utils/exceptions'
import FormModal, {
    CopyButtonWrapAppendix,
    ErrorLabel,
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
import { useConfigValueFromChain, useMediaQuery } from '~/hooks'
import { useInterceptHeartbeats } from '~/hooks/useInterceptHeartbeats'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import { stakeOnSponsorship } from '~/services/sponsorships'
import { waitForIndexedBlock } from '~/utils'
import { errorToast } from '~/utils/toast'
import Toast from '~/shared/toasts/Toast'
import { Layer } from '~/utils/Layer'
import { getSelfDelegationFraction } from '~/getters'
import { Abbr } from '~/components/Abbr'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { humanize } from '~/shared/utils/time'
import { truncate } from '~/shared/utils/text'
import { useWalletAccount } from '~/shared/stores/wallet'
import { useAllOperatorsForWalletQuery } from '~/hooks/operators'
import { SelectField2 } from '~/marketplace/components/SelectField2'
import { route } from '~/rs'

interface Props extends Pick<FormModalProps, 'onReject'> {
    amount?: string
    chainId: number
    onResolve?: () => void
    preselectedOperator: ParsedOperator
    sponsorship: ParsedSponsorship
}

function parseAmount(amount: string | undefined, decimals: number) {
    return !amount || amount === '0' ? '' : fromDecimals(amount, decimals).toString()
}

const limitErrorToaster = toaster(Toast, Layer.Toast)

function JoinSponsorshipModal({
    amount: amountProp = '0',
    chainId,
    onResolve,
    preselectedOperator,
    sponsorship,
    ...props
}: Props) {
    const { decimals = 18, symbol: tokenSymbol = 'DATA' } =
        useSponsorshipTokenInfo() || {}

    const wallet = useWalletAccount()

    const { data: operatorChoices = null } = useAllOperatorsForWalletQuery(wallet)

    const [operator, setSelectedOperator] = useState(preselectedOperator)

    const { id: operatorId, dataTokenBalanceWei: operatorBalance, metadata } = operator

    const hasUndelegationQueue = operator.queueEntries.length > 0

    const { streamId } = sponsorship

    const [busy, setBusy] = useState(false)

    const [rawAmount, setRawAmount] = useState(parseAmount(amountProp, decimals))

    const amount = toDecimals(rawAmount || '0', decimals)

    const finalAmount = amount.isFinite() && amount.isGreaterThan(0) ? amount : toBN(0)

    const heartbeats = useInterceptHeartbeats(operatorId)

    const { count: liveNodesCount, isLoading: liveNodesCountLoading } =
        useOperatorLiveNodes(heartbeats)

    let liveNodesOk = !liveNodesCountLoading && liveNodesCount > 0

    // Relax live node checking for broken operators as they cannot join the recovery sponsorship otherwise
    if (operator.contractVersion === 1) {
        liveNodesOk = true
    }

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

    const earlyLeaverPenaltyWei = useConfigValueFromChain('earlyLeaverPenaltyWei')
    const earlyLeaverPenalty = earlyLeaverPenaltyWei
        ? fromDecimals(earlyLeaverPenaltyWei, 18)
        : toBN(0)

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

    const minimumStakeWei = useConfigValueFromChain('minimumStakeWei')

    const isAboveMinimumStake = minimumStakeWei
        ? finalAmount.isGreaterThanOrEqualTo(toBN(minimumStakeWei))
        : true

    const canSubmit =
        finalAmount.isGreaterThan(0) &&
        !insufficientFunds &&
        liveNodesOk &&
        isAboveMinimumStake &&
        !hasUndelegationQueue &&
        !isBelowSelfFundingLimit

    const { copy } = useCopy()

    const limitedSpace = useMediaQuery('screen and (max-width: 460px)')

    const availableBalance = fromDecimals(operatorBalance, decimals)

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
                        chainId,
                        sponsorship.id,
                        finalAmount.toString(),
                        operator.id,
                        {
                            onBlockNumber: (blockNumber) =>
                                waitForIndexedBlock(chainId, blockNumber),
                        },
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
                <Label $wrap>Sponsorship Stream ID</Label>
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
                    <Label $wrap>Amount to stake</Label>
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
                    <MaxButton
                        onClick={() => {
                            setRawAmount(availableBalance.toString())
                        }}
                    />
                    <TextAppendix>{tokenSymbol}</TextAppendix>
                </FieldWrap>
                <PropList>
                    <li>
                        <Prop>Minimum stake duration</Prop>
                        <PropValue>
                            {humanize(sponsorship.minimumStakingPeriodSeconds)}
                        </PropValue>
                    </li>
                    <li>
                        <Prop $invalid={insufficientFunds}>
                            {insufficientFunds ? (
                                <>Not enough balance in Operator</>
                            ) : (
                                <>Available balance in Operator</>
                            )}
                        </Prop>
                        <PropValue>
                            {limitedSpace ? (
                                <Abbr>{availableBalance}</Abbr>
                            ) : (
                                <>
                                    {availableBalance.toString()}{' '}
                                    <SponsorshipPaymentTokenName />
                                </>
                            )}
                        </PropValue>
                    </li>
                    <li>
                        <Prop>Operator</Prop>
                        <PropValue>
                            {operatorChoices?.length === 1 ? (
                                <>
                                    {metadata.name != null
                                        ? `${metadata.name} (${truncate(operatorId)})`
                                        : operatorId}
                                </>
                            ) : (
                                <>
                                    <SelectField2
                                        placeholder="Operator"
                                        options={
                                            operatorChoices?.map((o) => ({
                                                value: o.id,
                                                label: `${o.metadata.name} (${truncate(
                                                    o.id,
                                                )})`,
                                            })) ?? []
                                        }
                                        value={operator.id}
                                        onChange={(id) => {
                                            const selectedOp = operatorChoices?.find(
                                                (o) => o.id === id,
                                            )
                                            if (selectedOp) {
                                                setSelectedOperator(selectedOp)
                                            }
                                        }}
                                        whiteVariant
                                        isClearable={false}
                                    />
                                </>
                            )}
                        </PropValue>
                    </li>
                </PropList>
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
            {sponsorship.minimumStakingPeriodSeconds > 0 && (
                <StyledAlert
                    type="error"
                    title={`This Sponsorship has a minimum staking period of ${humanize(
                        sponsorship.minimumStakingPeriodSeconds,
                    )}. If you unstake or get voted out during this period, you will lose 
                        ${earlyLeaverPenalty.toString()} ${tokenSymbol} in addition to the normal slashing penalty.`}
                ></StyledAlert>
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
                            href={route('docs', '/node-runners/run-a-node')}
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

export const joinSponsorshipModal = toaster(JoinSponsorshipModal, Layer.Modal)
