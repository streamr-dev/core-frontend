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
import Checkbox from '~/shared/components/Checkbox'

interface Props extends Omit<FormModalProps, 'canSubmit' | 'onSubmit'> {
    onResolve?: (sponsorshipId: string) => void
    onSubmit: (sponsorshipId: string) => Promise<void>
    tokenSymbol: string
    sponsorships: UndelegateSponsorship[]
    totalAmount: BN
}

interface UndelegateSponsorship {
    id: string
    streamId: string
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
    const joinDate = moment(joinTimestamp * 1000)
    const slashedBeforeDate = joinDate.clone().add(minimumStakingPeriodSeconds, 'seconds')
    return moment().isAfter(slashedBeforeDate)
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
    >(
        getOptimalSponsorship(sponsorships, totalAmount)?.id ??
            (sponsorships.length > 0 ? sponsorships[0].id : undefined),
    )
    const [busy, setBusy] = useState(false)

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
                    console.warn('Error while force undelegating', e)
                    setBusy(false)
                }
            }}
        >
            <SectionHeadline>
                Please select a sponsorship to undelegate{' '}
                {abbreviateNumber(fromAtto(totalAmount).toNumber())} {tokenSymbol} from
            </SectionHeadline>
            <ScrollTable
                elements={sponsorships}
                columns={[
                    {
                        displayName: 'Stream ID',
                        valueMapper: (element) => (
                            <>{truncateStreamName(element.streamId)}</>
                        ),
                        align: 'start',
                        isSticky: true,
                        key: 'streamid',
                    },
                    {
                        displayName: 'Amount',
                        valueMapper: (element) => (
                            <WarningCell>
                                {abbreviateNumber(fromAtto(element.amount).toNumber())}{' '}
                                {tokenSymbol}
                                {element.amount.isLessThan(totalAmount) && (
                                    <Tip
                                        handle={
                                            <TipIconWrap $color="#ff5c00">
                                                <JiraFailedBuildStatusIcon label="Error" />
                                            </TipIconWrap>
                                        }
                                    >
                                        <p>Not enough stake</p>
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
                                            days not reached. You will be slashed.
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
                                <Checkbox
                                    value={selectedSponsorshipId === element.id}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedSponsorshipId(element.id)
                                        } else {
                                            setSelectedSponsorshipId(undefined)
                                        }
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
        </ForceUndelegateFormModal>
    )
}

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
