import React, { useMemo } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { truncate, truncateStreamName } from '~/shared/utils/text'
import { abbreviateNumber } from '~/shared/utils/abbreviateNumber'
import { BlackTooltip } from '~/shared/components/Tooltip/Tooltip'
import Button from '~/shared/components/Button'
import useCopy from '~/shared/hooks/useCopy'
import SvgIcon from '~/shared/components/SvgIcon'
import routes from '~/routes'
import { SimpleDropdown } from '~/components/SimpleDropdown'
import { waitForGraphSync } from '~/getters/waitForGraphSync'
import { getBlockExplorerUrl } from '~/getters/getBlockExplorerUrl'
import { Separator } from '~/components/Separator'
import StatGrid, { StatCell } from '~/components/StatGrid'
import { Pad } from '~/components/ActionBars/OperatorActionBar'
import { useOperatorForWallet } from '~/hooks/operators'
import { useWalletAccount } from '~/shared/stores/wallet'
import { isSponsorshipFundedByOperator } from '~/utils/sponsorships'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import {
    NetworkActionBarBackButtonAndTitle,
    NetworkActionBarBackButtonIcon,
    NetworkActionBarBackLink,
    NetworkActionBarCaret,
    NetworkActionBarCTAs,
    NetworkActionBarInfoButton,
    NetworkActionBarInfoButtons,
    NetworkActionBarStatsTitle,
    NetworkActionBarTitle,
    SingleElementPageActionBar,
    SingleElementPageActionBarContainer,
    SingleElementPageActionBarTopPart,
} from '~/components/ActionBars/NetworkActionBar.styles'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import {
    useEditSponsorshipFunding,
    useFundSponsorship,
    useIsEditingSponsorshipFunding,
    useIsFundingSponsorship,
    useIsJoiningSponsorshipAsOperator,
    useJoinSponsorshipAsOperator,
} from '~/hooks/sponsorships'
import { isRejectionReason } from '~/modals/BaseModal'

export function SponsorshipActionBar({
    sponsorship,
    onChange,
}: {
    sponsorship: ParsedSponsorship
    onChange: () => void
}) {
    const { copy } = useCopy()

    const wallet = useWalletAccount()

    const operator = useOperatorForWallet(wallet)

    const canEditStake = isSponsorshipFundedByOperator(sponsorship, operator)

    const { projectedInsolvencyAt } = sponsorship

    const fundedUntil = useMemo(
        () => moment(projectedInsolvencyAt * 1000).format('D MMM YYYY'),
        [projectedInsolvencyAt],
    )

    const fundSponsorship = useFundSponsorship()

    const isFundingSponsorship = useIsFundingSponsorship(sponsorship.id, wallet)

    const joinSponsorshipAsOperator = useJoinSponsorshipAsOperator()

    const isJoiningSponsorshipAsOperator = useIsJoiningSponsorshipAsOperator(
        sponsorship.id,
        operator?.id,
        sponsorship.streamId,
    )

    const editSponsorshipFunding = useEditSponsorshipFunding()

    const isEditingSponsorshipFunding = useIsEditingSponsorshipFunding(
        sponsorship.id,
        operator?.id,
    )

    return (
        <SingleElementPageActionBar>
            <SingleElementPageActionBarContainer>
                <SingleElementPageActionBarTopPart>
                    <div>
                        <NetworkActionBarBackButtonAndTitle>
                            <NetworkActionBarBackLink to={routes.network.sponsorships()}>
                                <NetworkActionBarBackButtonIcon name="backArrow"></NetworkActionBarBackButtonIcon>
                            </NetworkActionBarBackLink>
                            <NetworkActionBarTitle>
                                {truncateStreamName(sponsorship.streamId, 30)}
                            </NetworkActionBarTitle>
                        </NetworkActionBarBackButtonAndTitle>
                        <NetworkActionBarInfoButtons>
                            <NetworkActionBarInfoButton
                                className={
                                    (sponsorship.active ? 'active ' : 'inactive') +
                                    ' bold'
                                }
                            >
                                {sponsorship.active ? 'Active' : 'Inactive'}
                            </NetworkActionBarInfoButton>
                            <SimpleDropdown
                                toggleElement={
                                    <NetworkActionBarInfoButton className="pointer bold">
                                        <SvgIcon name="page" />
                                        About Sponsorships
                                        <NetworkActionBarCaret name="caretDown" />
                                    </NetworkActionBarInfoButton>
                                }
                                dropdownContent={
                                    <AboutSponsorshipsContent>
                                        Sponsorships pay out tokens to staked operators
                                        for doing work in the network, i.e. relaying data
                                        in the associated stream. Sponsorships can be
                                        funded by anyone. Learn more{' '}
                                        <a
                                            href="https://docs.streamr.network/streamr-network/network-incentives"
                                            target="_blank"
                                            rel="noreferrer noopener"
                                        >
                                            here
                                        </a>
                                        .
                                    </AboutSponsorshipsContent>
                                }
                            />
                            <NetworkActionBarInfoButton>
                                <span>
                                    Funded until: <strong>{fundedUntil}</strong>
                                </span>
                            </NetworkActionBarInfoButton>
                            <NetworkActionBarInfoButton>
                                <span>
                                    Contract <strong>{truncate(sponsorship.id)}</strong>
                                </span>
                                <span>
                                    <SvgIcon
                                        name="copy"
                                        className="icon"
                                        data-tooltip-id="copy-sponsorship-address"
                                        onClick={() =>
                                            copy(sponsorship.id, {
                                                toastMessage: 'Copied!',
                                            })
                                        }
                                    />
                                    <BlackTooltip
                                        id="copy-sponsorship-address"
                                        openOnClick={false}
                                    >
                                        Copy address
                                    </BlackTooltip>
                                </span>
                                <a
                                    href={`${getBlockExplorerUrl()}/address/${
                                        sponsorship.id
                                    }`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <SvgIcon name="externalLink" />
                                </a>
                            </NetworkActionBarInfoButton>
                        </NetworkActionBarInfoButtons>
                    </div>
                    <NetworkActionBarCTAs>
                        <Button
                            waiting={isFundingSponsorship}
                            onClick={async () => {
                                if (!wallet) {
                                    return
                                }

                                try {
                                    await fundSponsorship({
                                        sponsorship,
                                        wallet,
                                    })

                                    await waitForGraphSync()

                                    onChange()
                                } catch (e) {
                                    if (isRejectionReason(e)) {
                                        return
                                    }

                                    console.warn('Could not fund a Sponsorship', e)
                                }
                            }}
                        >
                            Sponsor
                        </Button>
                        {canEditStake ? (
                            <Button
                                disabled={!operator}
                                waiting={isEditingSponsorshipFunding}
                                onClick={async () => {
                                    if (!operator) {
                                        return
                                    }

                                    try {
                                        await editSponsorshipFunding({
                                            sponsorship,
                                            operator,
                                        })

                                        await waitForGraphSync()

                                        onChange()
                                    } catch (e) {
                                        if (isRejectionReason(e)) {
                                            return
                                        }

                                        console.warn('Could not edit a Sponsorship', e)
                                    }
                                }}
                            >
                                Edit stake
                            </Button>
                        ) : (
                            <Button
                                disabled={!operator}
                                waiting={isJoiningSponsorshipAsOperator}
                                onClick={async () => {
                                    if (!operator) {
                                        return
                                    }

                                    try {
                                        await joinSponsorshipAsOperator({
                                            sponsorship,
                                            operator,
                                        })

                                        await waitForGraphSync()

                                        onChange()
                                    } catch (e) {
                                        if (isRejectionReason(e)) {
                                            return
                                        }

                                        console.warn(
                                            'Could not join a Sponsorship as an Operator',
                                            e,
                                        )
                                    }
                                }}
                            >
                                Join as operator
                            </Button>
                        )}
                    </NetworkActionBarCTAs>
                </SingleElementPageActionBarTopPart>
                <NetworkActionBarStatsTitle>
                    Sponsorship summary
                </NetworkActionBarStatsTitle>
                <Separator />
                <Pad>
                    <StatGrid>
                        <StatCell label="Payout rate">
                            {abbreviateNumber(sponsorship.payoutPerDay.toNumber())}{' '}
                            <SponsorshipPaymentTokenName />
                            /day
                        </StatCell>
                        <StatCell label="Operators">{sponsorship.operatorCount}</StatCell>
                        <StatCell label="Total staked">
                            {abbreviateNumber(sponsorship.totalStake.toNumber())}{' '}
                            <SponsorshipPaymentTokenName />
                        </StatCell>
                    </StatGrid>
                </Pad>
                <Separator />
                <Pad>
                    <StatGrid>
                        <StatCell label="APY">
                            {(sponsorship.apy * 100).toFixed(0)}%
                        </StatCell>
                        <StatCell label="Cumulative sponsored">
                            {abbreviateNumber(
                                sponsorship.cumulativeSponsoring.toNumber(),
                            )}{' '}
                            <SponsorshipPaymentTokenName />
                        </StatCell>
                        <StatCell label="Minimum stake">
                            {abbreviateNumber(sponsorship.minimumStake.toNumber())}{' '}
                            <SponsorshipPaymentTokenName />
                        </StatCell>
                    </StatGrid>
                </Pad>
            </SingleElementPageActionBarContainer>
        </SingleElementPageActionBar>
    )
}

const AboutSponsorshipsContent = styled.div`
    margin: 0;
    min-width: 250px;
`
