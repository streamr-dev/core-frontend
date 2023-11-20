import React, { ComponentProps, useMemo } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { truncate, truncateStreamName } from '~/shared/utils/text'
import Button from '~/shared/components/Button'
import SvgIcon from '~/shared/components/SvgIcon'
import routes from '~/routes'
import { SimpleDropdown } from '~/components/SimpleDropdown'
import { Separator } from '~/components/Separator'
import StatGrid, { StatCell } from '~/components/StatGrid'
import { Pad } from '~/components/ActionBars/OperatorActionBar'
import { useOperatorForWalletQuery } from '~/hooks/operators'
import { useWalletAccount } from '~/shared/stores/wallet'
import { isSponsorshipFundedByOperator } from '~/utils/sponsorships'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import {
    NetworkActionBarBackButtonAndTitle,
    NetworkActionBarBackButtonIcon,
    NetworkActionBarBackLink,
    NetworkActionBarCTAs,
    NetworkActionBarInfoButtons,
    NetworkActionBarStatsTitle,
    NetworkActionBarTitle,
    SingleElementPageActionBar,
    SingleElementPageActionBarContainer,
    SingleElementPageActionBarTopPart,
} from '~/components/ActionBars/NetworkActionBar.styles'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { Tip } from '~/components/Tip'
import {
    useEditSponsorshipFunding,
    useFundSponsorshipCallback,
    useIsEditingSponsorshipFunding,
    useIsFundingSponsorship,
    useIsJoiningSponsorshipAsOperator,
    useJoinSponsorshipAsOperator,
} from '~/hooks/sponsorships'
import { COLORS } from '~/shared/utils/styled'
import { abbr, goBack } from '~/utils'
import {
    ActionBarButton,
    ActionBarButtonBody,
    ActionBarButtonCaret,
    ActionBarButtonInnerBody,
    ActionBarWalletDisplay,
} from '~/components/ActionBars/ActionBarButton'
import { AboutSponsorship } from '~/components/ActionBars/AboutSponsorship'

const DayInSeconds = 60 * 60 * 24

export function SponsorshipActionBar({
    sponsorship,
}: {
    sponsorship: ParsedSponsorship
}) {
    const wallet = useWalletAccount()

    const { data: operator = null } = useOperatorForWalletQuery(wallet)

    const canEditStake = isSponsorshipFundedByOperator(sponsorship, operator)

    const { projectedInsolvencyAt, isRunning, remainingBalance } = sponsorship

    const isPaying = isRunning && remainingBalance.isGreaterThan(0)

    const fundedUntil = useMemo(
        () =>
            projectedInsolvencyAt == null
                ? null
                : moment(projectedInsolvencyAt * 1000).format('D MMM YYYY'),
        [projectedInsolvencyAt],
    )

    const minimumStakingDays = sponsorship.minimumStakingPeriodSeconds / DayInSeconds

    const fundSponsorship = useFundSponsorshipCallback()

    const isFundingSponsorship = useIsFundingSponsorship(sponsorship.id, wallet)

    const joinSponsorshipAsOperator = useJoinSponsorshipAsOperator()

    const isJoiningSponsorshipAsOperator = useIsJoiningSponsorshipAsOperator(
        sponsorship.id,
        operator?.id,
    )

    const editSponsorshipFunding = useEditSponsorshipFunding()

    const isEditingSponsorshipFunding = useIsEditingSponsorshipFunding(
        sponsorship.id,
        operator?.id,
    )

    const maxOperatorsReached = sponsorship.operatorCount >= sponsorship.maxOperators

    const { streamId } = sponsorship

    return (
        <SingleElementPageActionBar>
            <SingleElementPageActionBarContainer>
                <SingleElementPageActionBarTopPart>
                    <div>
                        <NetworkActionBarBackButtonAndTitle>
                            <NetworkActionBarBackLink
                                to={routes.network.sponsorships()}
                                onClick={(e) => {
                                    goBack({
                                        onBeforeNavigate() {
                                            e.preventDefault()
                                        },
                                    })
                                }}
                            >
                                <NetworkActionBarBackButtonIcon name="backArrow" />
                            </NetworkActionBarBackLink>
                            <NetworkActionBarTitle>
                                {streamId ? (
                                    truncateStreamName(streamId, 30)
                                ) : (
                                    <>Sponsorship {truncate(sponsorship.id)}</>
                                )}
                            </NetworkActionBarTitle>
                        </NetworkActionBarBackButtonAndTitle>
                        <NetworkActionBarInfoButtons>
                            <ActionBarButtonBody
                                $background={
                                    isPaying
                                        ? COLORS.activeBackground
                                        : COLORS.radioBorder
                                }
                                $color={isPaying ? COLORS.active : COLORS.primary}
                            >
                                <strong>{isPaying ? 'Paying' : 'Inactive'}</strong>
                            </ActionBarButtonBody>
                            <SimpleDropdown
                                menu={<AboutSponsorship sponsorship={sponsorship} />}
                            >
                                {(toggle, isOpen) => (
                                    <ActionBarButton
                                        active={isOpen}
                                        onClick={() => void toggle((c) => !c)}
                                    >
                                        <ActionBarButtonInnerBody>
                                            <SvgIcon name="page" />
                                            <strong>About Sponsorship</strong>
                                        </ActionBarButtonInnerBody>
                                        <ActionBarButtonCaret $invert={isOpen} />
                                    </ActionBarButton>
                                )}
                            </SimpleDropdown>
                            {fundedUntil && (
                                <ActionBarButtonBody>
                                    <div>
                                        Funded until: <strong>{fundedUntil}</strong>
                                    </div>
                                </ActionBarButtonBody>
                            )}
                            <ActionBarWalletDisplay
                                address={sponsorship.id}
                                label="Contract"
                            />
                        </NetworkActionBarInfoButtons>
                    </div>
                    <NetworkActionBarCTAs>
                        <Button
                            disabled={!streamId}
                            waiting={isFundingSponsorship}
                            onClick={() => {
                                fundSponsorship(sponsorship)
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

                                    editSponsorshipFunding({
                                        sponsorshipOrSponsorshipId: sponsorship,
                                        operator,
                                    })
                                }}
                            >
                                Edit stake
                            </Button>
                        ) : (
                            <Button
                                disabled={!operator || maxOperatorsReached || !streamId}
                                waiting={isJoiningSponsorshipAsOperator}
                                onClick={() => {
                                    if (!operator) {
                                        return
                                    }

                                    joinSponsorshipAsOperator({
                                        sponsorship,
                                        operator,
                                    })
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
                        <StatCell
                            label="Payout rate"
                            tip={
                                <Tip
                                    shift="right"
                                    handle={
                                        <IconWrap>
                                            <QuestionMarkIcon />
                                        </IconWrap>
                                    }
                                >
                                    <p>
                                        The rate of <SponsorshipPaymentTokenName /> tokens
                                        that are distributed to Operators that have staked
                                        on this Sponsorship.
                                    </p>
                                </Tip>
                            }
                        >
                            {abbr(sponsorship.payoutPerDay)}{' '}
                            <SponsorshipPaymentTokenName />
                            /day
                        </StatCell>
                        <StatCell label="Remaining balance">
                            {abbr(remainingBalance)} <SponsorshipPaymentTokenName />
                        </StatCell>
                        <StatCell
                            label="Total staked"
                            tip={
                                <Tip
                                    shift="right"
                                    handle={
                                        <IconWrap>
                                            <QuestionMarkIcon />
                                        </IconWrap>
                                    }
                                >
                                    <p>
                                        The total amount of{' '}
                                        <SponsorshipPaymentTokenName /> tokens that has
                                        been staked on this Sponsorship by&nbsp;Operators.
                                    </p>
                                </Tip>
                            }
                        >
                            {abbr(sponsorship.totalStake)} <SponsorshipPaymentTokenName />
                        </StatCell>
                    </StatGrid>
                </Pad>
                <Separator />
                <Pad>
                    <StatGrid>
                        <StatCell
                            label="APY"
                            tip={
                                <Tip
                                    shift="right"
                                    handle={
                                        <IconWrap>
                                            <QuestionMarkIcon />
                                        </IconWrap>
                                    }
                                >
                                    <p>
                                        The annualized yield that the staked Operators are
                                        currently earning from this Sponsorship.
                                    </p>
                                </Tip>
                            }
                        >
                            {(sponsorship.spotAPY * 100).toFixed(0)}%
                        </StatCell>
                        <StatCell
                            label="Total sponsored"
                            tip={
                                <Tip
                                    shift="right"
                                    handle={
                                        <IconWrap>
                                            <QuestionMarkIcon />
                                        </IconWrap>
                                    }
                                >
                                    <p>
                                        The cumulative amount of{' '}
                                        <SponsorshipPaymentTokenName /> tokens that
                                        Sponsors have funded this Sponsorship with.
                                    </p>
                                </Tip>
                            }
                        >
                            {abbr(sponsorship.cumulativeSponsoring)}{' '}
                            <SponsorshipPaymentTokenName />
                        </StatCell>
                        <StatCell
                            label="Minimum stake duration"
                            tip={
                                <Tip
                                    shift="right"
                                    handle={
                                        <IconWrap>
                                            <QuestionMarkIcon />
                                        </IconWrap>
                                    }
                                >
                                    <p>
                                        The minimum time that Operators must stay staked
                                        in this Sponsorship before they are able to fully
                                        unstake without a penalty. Stake reduction is
                                        always allowed and only limited by minimum stake.
                                    </p>
                                </Tip>
                            }
                        >
                            {minimumStakingDays.toFixed(0)} day
                            {minimumStakingDays !== 1 && 's'}
                        </StatCell>
                    </StatGrid>
                </Pad>
            </SingleElementPageActionBarContainer>
        </SingleElementPageActionBar>
    )
}

function getQuestionMarkIconAttrs(): ComponentProps<typeof SvgIcon> {
    return { name: 'outlineQuestionMark' }
}

const QuestionMarkIcon = styled(SvgIcon).attrs(getQuestionMarkIconAttrs)`
    display: block;
    height: 16px;
    width: 16px;
`

const IconWrap = styled.div<{ $color?: string }>`
    align-items: center;
    color: ${({ $color = 'inherit' }) => $color};
    display: flex;
    height: 24px;
    justify-content: center;
    position: relative;
    width: 24px;
`
