import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { SponsorshipElement } from '~/types/sponsorship'
import { truncate, truncateStreamName } from '~/shared/utils/text'
import { truncateNumber } from '~/shared/utils/truncateNumber'
import { BlackTooltip } from '~/shared/components/Tooltip/Tooltip'
import Button from '~/shared/components/Button'
import useCopy from '~/shared/hooks/useCopy'
import SvgIcon from '~/shared/components/SvgIcon'
import routes from '~/routes'
import { SimpleDropdown } from '~/components/SimpleDropdown'
import { useFundSponsorship } from '~/hooks/useFundSponsorship'
import { useJoinSponsorship } from '~/hooks/useJoinSponsorship'
import useTokenInfo from '~/hooks/useTokenInfo'
import { defaultChainConfig } from '~/getters/getChainConfig'
import getCoreConfig from '~/getters/getCoreConfig'
import { useEditStake } from '~/hooks/useEditStake'
import { waitForGraphSync } from '~/getters/waitForGraphSync'
import { getBlockExplorerUrl } from '~/getters/getBlockExplorerUrl'
import { Separator } from '~/components/Separator'
import StatGrid, { StatCell } from '~/components/StatGrid'
import { Pad } from '~/components/ActionBars/OperatorActionBar'
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
} from './NetworkActionBar.styles'

export const SponsorshipActionBar: FunctionComponent<{
    sponsorship: SponsorshipElement
    onChange: () => void
}> = ({ sponsorship, onChange }) => {
    const { copy } = useCopy()

    const fundSponsorship = useFundSponsorship()
    const { canJoinSponsorship, joinSponsorship } = useJoinSponsorship()
    const { canEditStake, editStake } = useEditStake()
    const tokenInfo = useTokenInfo(
        defaultChainConfig.contracts[getCoreConfig().sponsorshipPaymentToken],
        defaultChainConfig.id,
    )
    const tokenSymbol = tokenInfo?.symbol || 'DATA'

    return (
        <SingleElementPageActionBar>
            <SingleElementPageActionBarContainer>
                <SingleElementPageActionBarTopPart>
                    <div>
                        <NetworkActionBarBackButtonAndTitle>
                            <NetworkActionBarBackLink to={routes.network.sponsorships()}>
                                <NetworkActionBarBackButtonIcon
                                    name={'backArrow'}
                                ></NetworkActionBarBackButtonIcon>
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
                                    Funded until:{' '}
                                    <strong>{sponsorship.fundedUntil}</strong>
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
                            onClick={async () => {
                                await fundSponsorship(
                                    sponsorship.id,
                                    sponsorship.payoutPerDay,
                                )
                                await waitForGraphSync()
                                onChange()
                            }}
                        >
                            Sponsor
                        </Button>
                        {canEditStake(sponsorship) ? (
                            <Button
                                onClick={async () => {
                                    await editStake(sponsorship)
                                    await waitForGraphSync()
                                    onChange()
                                }}
                            >
                                Edit stake
                            </Button>
                        ) : (
                            <Button
                                disabled={!canJoinSponsorship}
                                onClick={async () => {
                                    await joinSponsorship(
                                        sponsorship.id,
                                        sponsorship.streamId,
                                    )
                                    await waitForGraphSync()
                                    onChange()
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
                            {sponsorship.payoutPerDay} {tokenSymbol}/day
                        </StatCell>
                        <StatCell label="Operators">{sponsorship.operators}</StatCell>
                        <StatCell label="Total staked">
                            {truncateNumber(Number(sponsorship.totalStake), 'thousands')}{' '}
                            {tokenSymbol}
                        </StatCell>
                    </StatGrid>
                </Pad>
                <Separator />
                <Pad>
                    <StatGrid>
                        <StatCell label="APY">{sponsorship.apy}%</StatCell>
                        <StatCell label="Cumulative sponsored">
                            {sponsorship.cumulativeSponsoring} {tokenSymbol}
                        </StatCell>
                        <StatCell label="Minimum stake">
                            {sponsorship.minimumStake} {tokenSymbol}
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
