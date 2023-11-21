import React, { useMemo, useState } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import { toaster } from 'toasterhea'
import FormModal, {
    FormModalProps,
    FormModalRoot,
    SectionHeadline,
} from '~/modals/FormModal'
import { Tip, TipIconWrap } from '~/components/Tip'
import { BN } from '~/utils/bn'
import { fromAtto } from '~/marketplace/utils/math'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import { Alert } from '~/components/Alert'
import { Radio } from '~/shared/components/Radio'
import { abbr, waitForIndexedBlock } from '~/utils'
import { Layer } from '~/utils/Layer'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { StreamIdCell } from '~/components/Table'
import { forceUnstakeFromSponsorship } from '~/services/sponsorships'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'

type OperatorStake = ParsedOperator['stakes'][0]

interface Props extends Pick<FormModalProps, 'onReject'> {
    amount: BN
    onResolve?: (sponsorshipId: string) => void
    operator: ParsedOperator
}

function getOptimalStake(
    stakes: OperatorStake[],
    requestedAmount: BN,
): OperatorStake | undefined {
    return (
        stakes.find(
            (s) =>
                isStakedLongEnough(s.joinTimestamp, s.minimumStakingPeriodSeconds) &&
                s.amountWei.isGreaterThanOrEqualTo(requestedAmount),
        ) || stakes[0]
    )
}

function isStakedLongEnough(joinTimestamp: number, minimumStakingPeriodSeconds: number) {
    return (joinTimestamp + minimumStakingPeriodSeconds) * 1000 < Date.now()
}

function ForceUndelegateModal({ amount, onResolve, operator, ...props }: Props) {
    const [busy, setBusy] = useState(false)

    const stakes = useMemo(
        () => [...operator.stakes].sort((a, b) => b.amountWei.comparedTo(a.amountWei)),
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
            selectedSponsorship.joinTimestamp,
            selectedSponsorship.minimumStakingPeriodSeconds,
        )

    const isPartialPayout =
        !!selectedSponsorship && selectedSponsorship.amountWei.isLessThan(amount)

    const canSubmit = !!selectedSponsorshipId

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
                        selectedSponsorshipId,
                        operator.id,
                        { onBlockNumber: waitForIndexedBlock },
                    )

                    onResolve?.(selectedSponsorshipId)
                } catch (e) {
                    console.warn('Error while force unstaking', e)
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
                                        {abbr(fromAtto(element.amountWei))}{' '}
                                        <SponsorshipPaymentTokenName />
                                        {element.amountWei.isLessThan(amount) && (
                                            <Tip
                                                handle={
                                                    <TipIconWrap $color="#ff5c00">
                                                        <JiraFailedBuildStatusIcon label="Error" />
                                                    </TipIconWrap>
                                                }
                                            >
                                                <p>Partial payout</p>
                                            </Tip>
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
                                        {moment(element.joinTimestamp * 1000).format(
                                            'YYYY-MM-DD',
                                        )}
                                        {!isStakedLongEnough(
                                            element.joinTimestamp,
                                            element.minimumStakingPeriodSeconds,
                                        ) && (
                                            <Tip
                                                handle={
                                                    <TipIconWrap $color="#ff5c00">
                                                        <JiraFailedBuildStatusIcon label="Error" />
                                                    </TipIconWrap>
                                                }
                                            >
                                                <p>
                                                    Minimum stake period of{' '}
                                                    {element.minimumStakingPeriodSeconds /
                                                        60 /
                                                        60 /
                                                        24}{' '}
                                                    days not reached. Operator will be
                                                    slashed.
                                                </p>
                                            </Tip>
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

    ${TipIconWrap} svg {
        width: 18px;
        height: 18px;
    }
`
