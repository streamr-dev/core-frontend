import React, { FunctionComponent, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { SponsorshipElement } from '~/network/types/sponsorship'
import { StatsBox } from '~/shared/components/StatsBox/StatsBox'
import { truncate, truncateStreamName } from '~/shared/utils/text'
import { truncateNumber } from '~/shared/utils/truncateNumber'
import useCopy from '~/shared/hooks/useCopy'
import SvgIcon from '~/shared/components/SvgIcon'
import routes from '~/routes'
import {
    CopyAddressTooltip,
    NetworkActionBarBackButtonAndTitle,
    NetworkActionBarBackButtonIcon,
    NetworkActionBarBackLink,
    NetworkActionBarInfoButton,
    NetworkActionBarInfoButtons,
    NetworkActionBarTitle,
    SingleElementPageActionBar,
    SingleElementPageActionBarContainer,
    SingleElementPageActionBarTopPart,
} from './NetworkActionBar.styles'

export const SponsorshipActionBar: FunctionComponent<{
    sponsorship: SponsorshipElement
}> = ({ sponsorship }) => {
    const { copy } = useCopy()

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
                                className={sponsorship.active ? 'active ' : 'inactive'}
                            >
                                Active
                            </NetworkActionBarInfoButton>
                            <NetworkActionBarInfoButton>
                                <SvgIcon name="page" />
                                About Sponsorships
                            </NetworkActionBarInfoButton>
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
                                                toastMessage: 'Contract address copied!',
                                            })
                                        }
                                    />
                                    <CopyAddressTooltip
                                        id="copy-sponsorship-address"
                                        openOnClick={false}
                                    >
                                        Copy address
                                    </CopyAddressTooltip>
                                </span>
                            </NetworkActionBarInfoButton>
                        </NetworkActionBarInfoButtons>
                    </div>
                    <p>sss</p>
                </SingleElementPageActionBarTopPart>
                <StatsBox
                    stats={[
                        {
                            label: 'Payout rate',
                            value:
                                new BigNumber(sponsorship.DATAPerDay).toFormat(18) +
                                ' DATA/day',
                        },
                        {
                            label: 'Operators',
                            value: String(sponsorship.operators),
                        },
                        {
                            label: 'Total staked',
                            value: truncateNumber(
                                Number(sponsorship.totalStake),
                                'thousands',
                            ),
                        },
                        {
                            label: 'APY',
                            value: sponsorship.apy + '%',
                        },
                        {
                            label: 'Cumulative sponsored',
                            value: 'NO DATA IN GRAPH',
                        },
                        {
                            label: 'Minimum stake',
                            value: 'NO DATA IN GRAPH',
                        },
                    ]}
                    columns={3}
                />
            </SingleElementPageActionBarContainer>
        </SingleElementPageActionBar>
    )
}

const SponsorshipStatBox: FunctionComponent<{ sponsorship: SponsorshipElement }> = ({
    sponsorship,
}) => {
    return (
        <StatsBox
            stats={[
                {
                    label: 'Payout',
                    value: 'NO DATA',
                },
                {
                    label: 'Operators',
                    value: String(sponsorship.operators),
                },
                {
                    label: 'Total staked',
                    value: truncateNumber(Number(sponsorship.totalStake), 'thousands'),
                },
                {
                    label: 'APY',
                    value: 'NO DATA',
                },
                {
                    label: 'Cumulative sponsored',
                    value: 'NO DATA',
                },
                {
                    label: 'Minimum stake',
                    value: 'NO DATA',
                },
            ]}
            columns={3}
        />
    )
}
