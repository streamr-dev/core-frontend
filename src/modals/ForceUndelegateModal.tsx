import React, { useMemo, useState } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import { truncateStreamName } from '~/shared/utils/text'
import FormModal, {
    FormModalProps,
    FormModalRoot,
    SectionHeadline,
} from '~/modals/FormModal'
import { Tip, TipIconWrap } from '~/components/Tip'
import { BN } from '~/utils/bn'
import { fromAtto } from '~/marketplace/utils/math'
import { abbreviateNumber } from '~/shared/utils/abbreviateNumber'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import { Alert } from '~/components/Alert'
import { Radio } from '~/shared/components/Radio'

interface Props extends Omit<FormModalProps, 'canSubmit' | 'onSubmit'> {
    onResolve?: (sponsorshipId: string) => void
    onSubmit: (sponsorshipId: string) => Promise<void>
    tokenSymbol: string
    sponsorships: UndelegateSponsorship[]
    totalAmount: BN
}

interface UndelegateSponsorship {
    id: string
    streamId: string | undefined
    amount: BN
    minimumStakingPeriodSeconds: number
    joinTimestamp: number
}

function getOptimalSponsorship(
    sponsorships: UndelegateSponsorship[],
    requestedAmount: BN,
): UndelegateSponsorship | undefined {
    return sponsorships.find(
        (s) =>
            hasStakedLongEnough(s.joinTimestamp, s.minimumStakingPeriodSeconds) &&
            s.amount.isGreaterThanOrEqualTo(requestedAmount),
    )
}

function hasStakedLongEnough(joinTimestamp: number, minimumStakingPeriodSeconds: number) {
    return (joinTimestamp + minimumStakingPeriodSeconds) * 1000 < Date.now()
}

export default function ForceUndelegateModal({
    title = 'Force unstake',
    onResolve,
    onSubmit,
    submitLabel = 'Force unstake',
    tokenSymbol,
    sponsorships: unsortedSponsorships,
    totalAmount,
    ...props
}: Props) {
    const sponsorships = useMemo(
        () => [...unsortedSponsorships].sort((a, b) => b.amount.comparedTo(a.amount)),
        [unsortedSponsorships],
    )

    const [selectedSponsorshipId, setSelectedSponsorshipId] = useState<
        string | undefined
    >(getOptimalSponsorship(sponsorships, totalAmount)?.id || sponsorships[0]?.id)
    const [busy, setBusy] = useState(false)

    const willSlash = useMemo(() => {
        const sponsorship = sponsorships.find((s) => s.id === selectedSponsorshipId)
        if (sponsorship) {
            return !hasStakedLongEnough(
                sponsorship.joinTimestamp,
                sponsorship.minimumStakingPeriodSeconds,
            )
        }
        return false
    }, [selectedSponsorshipId, sponsorships])

    const isPartialPayout = useMemo(() => {
        const sponsorship = sponsorships.find((s) => s.id === selectedSponsorshipId)
        if (sponsorship) {
            return sponsorship.amount.isLessThan(totalAmount)
        }
        return false
    }, [selectedSponsorshipId, sponsorships, totalAmount])

    const canSubmit = selectedSponsorshipId != null

    return (
        <ForceUndelegateFormModal
            {...props}
            title={title}
            canSubmit={canSubmit && !busy}
            submitting={busy}
            submitLabel={submitLabel}
            onSubmit={async () => {
                setBusy(true)
                try {
                    if (selectedSponsorshipId != null) {
                        await onSubmit(selectedSponsorshipId)
                        onResolve?.(selectedSponsorshipId)
                    }
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
                        elements={sponsorships}
                        columns={[
                            {
                                displayName: 'Stream ID',
                                valueMapper: (element) => (
                                    <>
                                        {element.streamId != null
                                            ? truncateStreamName(element.streamId)
                                            : '(deleted stream)'}
                                    </>
                                ),
                                align: 'start',
                                isSticky: true,
                                key: 'streamid',
                            },
                            {
                                displayName: 'Amount',
                                valueMapper: (element) => (
                                    <WarningCell>
                                        {abbreviateNumber(
                                            fromAtto(element.amount).toNumber(),
                                        )}{' '}
                                        {tokenSymbol}
                                        {element.amount.isLessThan(totalAmount) && (
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
                                        {!hasStakedLongEnough(
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
                                valueMapper: (element) => (
                                    <>
                                        <Radio
                                            name="undelegate-sponsorship"
                                            id={`undelegate-sponsorship-${element.id}`}
                                            label=""
                                            value={element.id}
                                            checked={selectedSponsorshipId === element.id}
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
