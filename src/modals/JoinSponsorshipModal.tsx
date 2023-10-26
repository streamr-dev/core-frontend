import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components'
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

interface Props extends Omit<FormModalProps, 'canSubmit' | 'onSubmit'> {
    onSubmit: (amountWei: string) => void | Promise<void>
    onResolve?: (amountWei: string) => void
    operatorBalance?: string
    tokenSymbol?: string
    decimals?: number
    operatorId: string
    hasUndelegationQueue: boolean
    amount?: string
    streamId?: string
}

function parseAmount(amount: string | undefined) {
    return typeof amount === 'undefined' || /^0?$/.test(amount)
        ? ''
        : toBN(amount).dividedBy(1e18).toString()
}

export default function JoinSponsorshipModal({
    title = 'Join Sponsorship as Operator',
    submitLabel = 'Join',
    onResolve,
    onSubmit,
    operatorBalance: operatorBalanceProp = '0',
    operatorId,
    hasUndelegationQueue,
    amount: amountProp = '0',
    streamId: streamIdProp,
    tokenSymbol = 'DATA',
    decimals = 18,
    ...props
}: Props) {
    const streamId = streamIdProp || 'N/A'

    const [busy, setBusy] = useState(false)

    const operatorBalance = toBN(operatorBalanceProp)

    const [rawAmount, setRawAmount] = useState(parseAmount(amountProp))

    const amount = toDecimals(rawAmount || '0', decimals)

    const finalAmount = amount.isFinite() && amount.isGreaterThan(0) ? amount : toBN(0)

    const heartbeats = useInterceptHeartbeats(operatorId)

    const { count: liveNodesCount, isLoading: liveNodesCountLoading } =
        useOperatorLiveNodes(heartbeats)

    useEffect(() => {
        setRawAmount(parseAmount(amountProp))
    }, [amountProp])

    const insufficientFunds = finalAmount.isGreaterThan(operatorBalance)

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
        !hasUndelegationQueue

    const { copy } = useCopy()

    return (
        <FormModal
            {...props}
            title={title}
            canSubmit={canSubmit && !busy}
            submitLabel={submitLabel}
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
                    await onSubmit(finalAmount.toString())
                    onResolve?.(finalAmount.toString())
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
                    {!!streamIdProp && (
                        <CopyButtonWrapAppendix>
                            <button type="button" onClick={() => void copy(streamIdProp)}>
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
                        value={rawAmount}
                    />
                    <TextAppendix>{tokenSymbol}</TextAppendix>
                </FieldWrap>
                <ul>
                    <li>
                        <Prop $invalid={insufficientFunds}>
                            {insufficientFunds ? (
                                <>Not enough balance in Operator contract</>
                            ) : (
                                <>Available balance in Operator contract</>
                            )}
                        </Prop>
                        <div>
                            {fromDecimals(operatorBalance, decimals).toString()}{' '}
                            {tokenSymbol}
                        </div>
                    </li>
                    <li>
                        <Prop>Operator ID</Prop>
                        <div>{operatorId}</div>
                    </li>
                </ul>
            </Section>
            {hasUndelegationQueue ? (
                <StyledAlert type="error" title="Warning!">
                    Cannot stake on sponsorship while delegators are awaiting undelegation
                </StyledAlert>
            ) : (
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
    }
`

const LinkIcon = styled(SvgIcon)`
    width: 24px;
`

const StyledLabelWrap = styled(WingedLabelWrap)`
    margin-top: 10px;
`
