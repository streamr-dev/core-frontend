import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { WhiteBox, WhiteBoxPaddingStyles } from '~/shared/components/WhiteBox'
import { connectModal } from '~/modals/ConnectModal'
import Button from '~/shared/components/Button'
import { COLORS, MD, MEDIUM } from '~/shared/utils/styled'

export const SummaryContainer = styled(WhiteBox)`
    margin-bottom: 24px;
    position: relative;

    .title {
        ${WhiteBoxPaddingStyles}
    }

    .summary-container {
        transition: filter 200ms ease-in-out;
    }

    .blur {
        filter: blur(5px);
    }

    .stat-box-wrap {
        @media (max-width: ${MD}px) {
            ${WhiteBoxPaddingStyles};
            padding-top: 0;
            padding-bottom: 0;
        }
    }
`
export const StreamInfoCell = styled.div`
    display: flex;
    flex-direction: column;
    line-height: 26px;

    .stream-id {
        font-weight: ${MEDIUM};
        color: ${COLORS.primary};
    }

    .stream-description {
        font-size: 14px;
        max-width: 208px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .stream-description:empty {
        display: none;
    }
`

const WalletNotConnectedBackground = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
`

const WalletNotConnectedInner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px;
    text-align: center;

    .connect-wallet-text {
        font-size: 16px;
        color: ${COLORS.primaryLight};
        margin-bottom: 24px;
    }
`
export const WalletNotConnectedOverlay: FunctionComponent<{ summaryTitle: string }> = ({
    summaryTitle,
}) => {
    return (
        <WalletNotConnectedBackground>
            <WalletNotConnectedInner>
                <p className="connect-wallet-text">
                    Please connect wallet to view your {summaryTitle}
                </p>
                <Button
                    kind="primary"
                    size="mini"
                    outline
                    type="button"
                    onClick={async () => {
                        try {
                            await connectModal.pop()
                        } catch (e) {
                            console.warn('Wallet connecting failed', e)
                        }
                    }}
                >
                    Connect
                </Button>
            </WalletNotConnectedInner>
        </WalletNotConnectedBackground>
    )
}

const randomIntFromInterval = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const today = moment()
export const growingValuesGenerator = (
    maxDays: number,
    maxValue: number,
): { day: number; value: number }[] => {
    return new Array(maxDays).fill(null).map((_, index) => {
        return {
            day: Number(
                today
                    .clone()
                    .subtract(maxDays - index + 1, 'days')
                    .format('x'),
            ),
            value:
                index === maxDays - 1
                    ? maxValue
                    : Math.round(
                          maxValue *
                              ((((index + 1) / maxDays) * randomIntFromInterval(7, 10)) /
                                  10),
                      ),
        }
    })
}
