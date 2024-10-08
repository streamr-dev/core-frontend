import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import { Alert } from '~/components/Alert'
import { Decimals } from '~/components/Decimals'
import { StreamIdCell } from '~/components/Table'
import { Tooltip, TooltipIconWrap } from '~/components/Tooltip'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import FormModal, {
    FormModalProps,
    FormModalRoot,
    SectionHeadline,
} from '~/modals/FormModal'
import { Operator } from '~/parsers/Operator'
import { forceUnstakeFromSponsorship } from '~/services/sponsorships'
import { Radio } from '~/shared/components/Radio'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import { waitForIndexedBlock } from '~/utils'
import { Layer } from '~/utils/Layer'
import { isRejectionReason, isTransactionRejection } from '~/utils/exceptions'

type OperatorStake = Operator['stakes'][0]

interface Props extends Pick<FormModalProps, 'onReject'> {
    amount: bigint
    chainId: number
    onResolve?: (sponsorshipId: string) => void
    operator: Operator
}

function getOptimalStake(
    stakes: OperatorStake[],
    requestedAmount: bigint,
): OperatorStake | undefined {
    return (
        stakes.find(
            (s) =>
                isStakedLongEnough(s.joinedAt, s.minimumStakingPeriodSeconds) &&
                s.amountWei >= requestedAmount,
        ) || stakes[0]
    )
}

function isStakedLongEnough(joinedAt: Date, minimumStakingPeriodSeconds: number) {
    return joinedAt.getTime() + minimumStakingPeriodSeconds * 1000 < Date.now()
}

function ForceUndelegateModal({ amount, onResolve, operator, chainId, ...props }: Props) {
    const [busy, setBusy] = useState(false)

    const stakes = useMemo(
        () => [...operator.stakes].sort((a, b) => (b.amountWei > a.amountWei ? -1 : 1)),
        [operator],
    )

    const [selectedSponsorshipId, setSelectedSponsorshipId] = useState<
        string | undefined
    >(getOptimalStake(stakes, amount)?.sponsorshipId)

    const selectedSponsorship = useMemo(
        () => stakes.find((s) => s.sponsorshipId === selectedSponsorshipId),
        [stakes, selectedSponsorshipId],
    )

    const willSlash =
        !!selectedSponsorship &&
        !isStakedLongEnough(
            selectedSponsorship.joinedAt,
            selectedSponsorship.minimumStakingPeriodSeconds,
        )

    const isPartialPayout =
        !!selectedSponsorship && selectedSponsorship.amountWei < amount

    const canSubmit = !!selectedSponsorshipId

    const { decimals = 18n } = useSponsorshipTokenInfo() || {}

    return (
        <ForceUndelegateFormModal
            {...props}
            title="Force unstake"
            canSubmit={canSubmit && !busy}
            submitting={busy}
            submitLabel="Force unstake"
            onSubmit={async () => {
                if (!canSubmit) {
                    return
                }

                setBusy(true)

                try {
                    await forceUnstakeFromSponsorship(
                        chainId,
                        selectedSponsorshipId,
                        operator.id,
                        {
                            onReceipt: ({ blockNumber }) =>
                                waitForIndexedBlock(chainId, blockNumber),
                        },
                    )

                    onResolve?.(selectedSponsorshipId)
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
            <Root>
                <SectionHeadline>
                    Because there are expired items in the undelegation queue, you can
                    force the Operator to unstake from any Sponsorship, in order to pay
                    out the queued undelegations.
                </SectionHeadline>
                <TableWrap>
                    <ScrollTable
                        elements={stakes}
                        columns={[
                            {
                                displayName: 'Stream ID',
                                valueMapper: ({ streamId }) => (
                                    <StreamIdCell streamId={streamId} />
                                ),
                                align: 'start',
                                isSticky: true,
                                key: 'streamid',
                            },
                            {
                                displayName: 'Amount',
                                valueMapper: (element) => (
                                    <WarningCell>
                                        <Decimals
                                            abbr
                                            amount={element.amountWei}
                                            decimals={decimals}
                                            tooltip
                                        />
                                        {element.amountWei < amount && (
                                            <Tooltip content={<p>Partial payout</p>}>
                                                <TooltipIconWrap $color="#ff5c00">
                                                    <JiraFailedBuildStatusIcon label="Error" />
                                                </TooltipIconWrap>
                                            </Tooltip>
                                        )}
                                    </WarningCell>
                                ),
                                align: 'start',
                                isSticky: false,
                                key: 'amount',
                            },
                            {
                                displayName: 'Joined',
                                valueMapper: (element) => (
                                    <WarningCell>
                                        {moment(element.joinedAt).format('YYYY-MM-DD')}
                                        {!isStakedLongEnough(
                                            element.joinedAt,
                                            element.minimumStakingPeriodSeconds,
                                        ) && (
                                            <Tooltip
                                                content={
                                                    <p>
                                                        Minimum stake period of{' '}
                                                        {element.minimumStakingPeriodSeconds /
                                                            60 /
                                                            60 /
                                                            24}{' '}
                                                        days not reached. Operator will be
                                                        slashed.
                                                    </p>
                                                }
                                            >
                                                <TooltipIconWrap $color="#ff5c00">
                                                    <JiraFailedBuildStatusIcon label="Error" />
                                                </TooltipIconWrap>
                                            </Tooltip>
                                        )}
                                    </WarningCell>
                                ),
                                align: 'start',
                                isSticky: false,
                                key: 'joined',
                            },
                            {
                                displayName: '',
                                valueMapper: ({ sponsorshipId: id }) => (
                                    <>
                                        <Radio
                                            name="undelegate-sponsorship"
                                            id={`undelegate-sponsorship-${id}`}
                                            label=""
                                            value={id}
                                            checked={selectedSponsorshipId === id}
                                            onChange={(value) => {
                                                setSelectedSponsorshipId(value)
                                            }}
                                        />
                                    </>
                                ),
                                align: 'end',
                                isSticky: false,
                                key: 'actions',
                            },
                        ]}
                    />
                </TableWrap>
                {willSlash && (
                    <Alert type="error" title="Operator will be slashed">
                        Selecting this Sponsorship will result in slashing. Please
                        consider selecting a different Sponsorship if available.
                    </Alert>
                )}
                {isPartialPayout && (
                    <Alert type="error" title="Partial payout">
                        Unstaking from this Sponsorship will not completely cover the
                        queued undelegation. After unstaking, you can select additional
                        Sponsorships to continue payouts.
                    </Alert>
                )}
            </Root>
        </ForceUndelegateFormModal>
    )
}

export const forceUndelegateModal = toaster(ForceUndelegateModal, Layer.Modal)

const Root = styled.div`
    display: grid;
    grid-template-rows: auto auto auto;
    gap: 16px;
`

const TableWrap = styled.div`
    max-height: ${90 * 6}px;
    overflow: auto;
`

const ForceUndelegateFormModal = styled(FormModal)`
    & ${FormModalRoot} {
        max-width: 848px;
    }
`

const WarningCell = styled.div`
    align-items: center;
    display: grid;
    gap: 8px;
    grid-template-columns: auto auto;

    ${TooltipIconWrap} svg {
        width: 18px;
        height: 18px;
    }
`
