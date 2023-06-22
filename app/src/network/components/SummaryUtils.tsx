import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import moment from 'moment'
import { WhiteBox, WhiteBoxPaddingStyles } from '$shared/components/WhiteBox'
import ConnectModal from '$app/src/modals/ConnectModal'
import { Layer } from '$utils/Layer'
import Button from '$shared/components/Button'
import { COLORS } from '$shared/utils/styled'

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
`
export const NetworkChartWrap = styled.div`
    ${WhiteBoxPaddingStyles}
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
                            await toaster(ConnectModal, Layer.Modal).pop()
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
                    : maxValue *
                      ((((index + 1) / maxDays) * randomIntFromInterval(7, 10)) / 10),
        }
    })
}
