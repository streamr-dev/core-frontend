import React, { FunctionComponent, useMemo } from 'react'
import { toaster } from 'toasterhea'
import { SponsorshipElement } from '~/types/sponsorship'
import { StatsBox } from '~/shared/components/StatsBox/StatsBox'
import { truncate, truncateStreamName } from '~/shared/utils/text'
import { truncateNumber } from '~/shared/utils/truncateNumber'
import JoinSponsorshipModal from '~/modals/JoinSponsorshipModal'
import FundSponsorshipModal from '~/modals/FundSponsorshipModal'
import DelegateFundsModal from '~/modals/DelegateFundsModal'
import { BlackTooltip } from '~/shared/components/Tooltip/Tooltip'
import Button from '~/shared/components/Button'
import useCopy from '~/shared/hooks/useCopy'
import SvgIcon from '~/shared/components/SvgIcon'
import { WhiteBoxSeparator } from '~/shared/components/WhiteBox'
import useOperatorLiveNodes from '~/hooks/useOperatorLiveNodes'
import { Layer } from '~/utils/Layer'
import routes from '~/routes'
import { OperatorElement } from '~/types/operator'
import { calculateOperatorSpotAPY } from '~/utils/apy'
import { getStakeForAddress } from '~/utils/delegation'
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

const delegateFundsModal = toaster(DelegateFundsModal, Layer.Modal)
const undelegateFundsModal = toaster(DelegateFundsModal, Layer.Modal)

export const OperatorActionBar: FunctionComponent<{
    operator: OperatorElement
}> = ({ operator }) => {
    const { copy } = useCopy()
    const { count: liveNodeCount } = useOperatorLiveNodes(operator.id)

    const ownerDelegationPercentage = useMemo(() => {
        const stake = getStakeForAddress(operator.owner, operator)
        return stake.dividedBy(operator.poolValue).multipliedBy(100)
    }, [operator])

    // TODO when Mariusz will merge his hook & getter for fetching Token information - use it here to display the proper token symbol

    return (
        <SingleElementPageActionBar>
            <SingleElementPageActionBarContainer>
                <SingleElementPageActionBarTopPart>
                    <div>
                        <NetworkActionBarBackButtonAndTitle>
                            <NetworkActionBarBackLink to={routes.network.operators()}>
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
                                    await delegateFundsModal.pop({
                                        operatorId: operator.id,
                                    })
                                } catch (e) {
                                    // Ignore for now.
                                }
                            }}
                        >
                            Delegate
                        </Button>
                        <Button
                            onClick={async () => {
                                try {
                                    await undelegateFundsModal.pop({})
                                } catch (e) {
                                    // Ignore for now.
                                }
                            }}
                        >
                            Undelegate
                        </Button>
                    </NetworkActionBarCTAs>
                </SingleElementPageActionBarTopPart>
                <NetworkActionBarStatsTitle>Operator summary</NetworkActionBarStatsTitle>
                <WhiteBoxSeparator />
                <StatsBox
                    stats={[
                        {
                            label: 'Total value',
                            value: operator.poolValue.toString(),
                        },
                        {
                            label: 'Deployed stake',
                            value: operator.totalValueInSponsorshipsWei.toString(),
                        },
                        {
                            label: "Owner's delegation",
                            value: `${ownerDelegationPercentage.toString()}%`,
                        },
                        {
                            label: 'Sponsorships',
                            value: operator.stakes.length.toString(),
                        },
                        {
                            label: "Operator's cut",
                            value: `${operator.operatorsShareFraction
                                .dividedBy(100)
                                .toString()}%`,
                        },
                        {
                            label: 'Spot APY',
                            value: `${calculateOperatorSpotAPY(operator)}%`,
                        },
                        {
                            label: 'Cumulative earnings',
                            value: `${operator.cumulativeProfitsWei
                                .plus(operator.cumulativeOperatorsShareWei)
                                .toString()}`,
                        },
                        {
                            label: 'Live nodes',
                            value: liveNodeCount.toString(),
                        },
                    ]}
                    columns={4}
                />
            </SingleElementPageActionBarContainer>
        </SingleElementPageActionBar>
    )
}
