import React, { useState } from 'react'
import styled from 'styled-components'
import { truncateStreamName } from '~/shared/utils/text'
import FormModal, { FormModalProps, Section, SectionHeadline } from '~/modals/FormModal'
import Label from '~/shared/components/Ui/Label'

import { SearchDropdown } from '~/components/SearchDropdown'
import { BN } from '~/utils/bn'
import { fromAtto } from '~/marketplace/utils/math'
import { abbreviateNumber } from '~/shared/utils/abbreviateNumber'

interface Props extends Omit<FormModalProps, 'canSubmit' | 'onSubmit'> {
    onResolve?: (sponsorshipId: string) => void
    onSubmit: (sponsorshipId: string) => Promise<void>
    tokenSymbol: string
    sponsorships: UndelegateSponsorship[]
}

interface UndelegateSponsorship {
    id: string
    streamId: string
    amount: BN
}

export default function ForceUndelegateModal({
    title = 'Force unstake',
    onResolve,
    onSubmit,
    submitLabel = 'Undelegate',
    tokenSymbol,
    sponsorships,
    ...props
}: Props) {
    const [selectedSponsorshipId, setSelectedSponsorshipId] = useState<string>()
    const [busy, setBusy] = useState(false)

    const canSubmit = selectedSponsorshipId != null

    return (
        <FormModal
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
                Please select sponsorship to undelegate from
            </SectionHeadline>
            <Section>
                <Label>Sponsorship</Label>
                <SearchDropdown
                    name="sponsorship"
                    onSelect={(selection) => {
                        console.log('select', selection)
                        setSelectedSponsorshipId(selection)
                    }}
                    onSearchInputChange={(input) => {
                        console.log('input changed', input)
                    }}
                    options={sponsorships.map((s) => ({
                        label: `${truncateStreamName(s.streamId)} (${abbreviateNumber(
                            fromAtto(s.amount).toNumber(),
                        )} ${tokenSymbol})`,
                        value: s.id,
                    }))}
                    isLoadingOptions={false}
                    placeholder="Type to select a sponsorship"
                    value={selectedSponsorshipId}
                />
            </Section>
        </FormModal>
    )
}
