import React, { FunctionComponent } from 'react'
import { toaster } from 'toasterhea'
import { SponsorshipElement } from '~/types/sponsorship'
import { StatsBox } from '~/shared/components/StatsBox/StatsBox'
import { truncate, truncateStreamName } from '~/shared/utils/text'
import { truncateNumber } from '~/shared/utils/truncateNumber'
import JoinSponsorshipModal from '~/modals/JoinSponsorshipModal'
import FundSponsorshipModal from '~/modals/FundSponsorshipModal'
import { BlackTooltip } from '~/shared/components/Tooltip/Tooltip'
import Button from '~/shared/components/Button'
import useCopy from '~/shared/hooks/useCopy'
import SvgIcon from '~/shared/components/SvgIcon'
import { WhiteBoxSeparator } from '~/shared/components/WhiteBox'
import { Layer } from '~/utils/Layer'
import routes from '~/routes'
import { OperatorElement } from '~/types/operator'
import { calculateOperatorSpotAPY } from '~/utils/apy'
import {
    NetworkActionBarBackButtonAndTitle,
    NetworkActionBarBackButtonIcon,
    NetworkActionBarBackLink,
    NetworkActionBarCTAs,
    NetworkActionBarInfoButton,
    NetworkActionBarInfoButtons,
    NetworkActionBarStatsTitle,
    NetworkActionBarTitle,
    SingleElementPageActionBar,
    SingleElementPageActionBarContainer,
    SingleElementPageActionBarTopPart,
} from './NetworkActionBar.styles'

const joinSponsorshipModal = toaster(JoinSponsorshipModal, Layer.Modal)
const fundSponsorshipModal = toaster(FundSponsorshipModal, Layer.Modal)

export const OperatorActionBar: FunctionComponent<{
    operator: OperatorElement
}> = ({ operator }) => {
    const { copy } = useCopy()

    // TODO when Mariusz will merge his hook & getter for fetching Token information - use it here to display the proper token symbol

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
                            <NetworkActionBarTitle>{operator.id}</NetworkActionBarTitle>
                        </NetworkActionBarBackButtonAndTitle>
                        <NetworkActionBarInfoButtons>
                            <NetworkActionBarInfoButton>
                                <SvgIcon name="page" />
                                About Operators
                            </NetworkActionBarInfoButton>
                            <NetworkActionBarInfoButton>
                                <span>
                                    Owner: <strong>{operator.owner}</strong>
                                </span>
                            </NetworkActionBarInfoButton>

                            <NetworkActionBarInfoButton>
                                <span>
                                    Contract <strong>{truncate(operator.id)}</strong>
                                </span>
                                <span>
                                    <SvgIcon
                                        name="copy"
                                        className="icon"
                                        data-tooltip-id="copy-sponsorship-address"
                                        onClick={() =>
                                            copy(operator.id, {
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
                                    href={
                                        'https://polygonscan.com/address/' + operator.id
                                    }
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
                                try {
                                    await fundSponsorshipModal.pop()
                                } catch (e) {
                                    // Ignore for now.
                                }
                            }}
                        >
                            Sponsor
                        </Button>
                        <Button
                            onClick={async () => {
                                try {
                                    await joinSponsorshipModal.pop({
                                        streamId: undefined,
                                    })
                                } catch (e) {
                                    // Ignore for now.
                                }
                            }}
                        >
                            Join as operator
                        </Button>
                    </NetworkActionBarCTAs>
                </SingleElementPageActionBarTopPart>
                <NetworkActionBarStatsTitle>
                    Sponsorship summary
                </NetworkActionBarStatsTitle>
                <WhiteBoxSeparator />
                <StatsBox
                    stats={[
                        {
                            label: 'Total value',
                            value: operator.poolValue + ' DATA',
                        },
                        {
                            label: 'Deployed stake',
                            value: operator.totalValueInSponsorshipsWei.toString(),
                        },
                        {
                            label: "Owner's delegation",
                            value: '0',
                        },
                        {
                            label: 'Sponsorships',
                            value: operator.stakes.length.toString(),
                        },
                        {
                            label: "Operator's cut",
                            value: `TODO`,
                        },
                        {
                            label: 'Spot APY',
                            value: calculateOperatorSpotAPY(operator).toString(),
                        },
                        {
                            label: 'Cumulative earnings',
                            value: 'TODO' + ' DATA',
                        },
                        {
                            label: 'Live nodes',
                            value: '1337',
                        },
                    ]}
                    columns={3}
                />
            </SingleElementPageActionBarContainer>
        </SingleElementPageActionBar>
    )
}
