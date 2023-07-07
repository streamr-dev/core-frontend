import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { useWalletAccount } from '~/shared/stores/wallet'
import {
    StreamInfoCell,
    SummaryContainer,
    WalletNotConnectedOverlay,
} from '~/network/components/NetworkUtils'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import { WhiteBoxSeparator } from '~/shared/components/WhiteBox'
import useIsMounted from '~/shared/hooks/useIsMounted'
import { truncateStreamName } from '~/shared/utils/text'
import { NoData } from '~/shared/components/NoData'
import { truncateNumber } from '~/shared/utils/truncateNumber'
import routes from '~/routes'
import { SponsorshipElement } from '../types/sponsorship'
import { NetworkSectionTitle } from './NetworkSectionTitle'

const hardcodedData: SponsorshipElement[] = [
    {
        streamId: 'jollygood.eth/my/funded/stream',
        streamDescription: 'Price, volume data feed for the DATAUSD',
        apy: 24.6,
        DATAPerDay: '1200',
        totalStake: '1500000',
        operators: 54,
        fundedUntil: moment().add(1, 'month').format('DD-mm-YYYY'),
        id: '45c5027a-ce52-49e2-9787-7f5599ce85cf',
        active: true,
        stakes: [],
    },
    {
        streamId: 'HSL/helsinki/trams',
        streamDescription: 'Real-time location of Helsinki trams',
        apy: 14.5,
        DATAPerDay: '4347',
        totalStake: '2300000',
        operators: 10,
        fundedUntil: moment().add(50, 'days').format('DD-mm-YYYY'),
        id: 'add2771e-111d-451a-ae50-6fb93f5da616',
        active: false,
        stakes: [],
    },
]

export const MySponsorshipsTable: FunctionComponent = () => {
    const isMounted = useIsMounted()
    const walletConnected = !!useWalletAccount()
    const hasSponsorships = true // todo fetch from state

    const sponsorships: SponsorshipElement[] = hardcodedData // todo fetch from state
    return (
        <SummaryContainer>
            <div className="title">
                <NetworkSectionTitle>My sponsorships</NetworkSectionTitle>
            </div>
            <WhiteBoxSeparator />
            {hasSponsorships ? (
                <>
                    <div
                        className={
                            'summary-container ' +
                            (isMounted() && !walletConnected ? 'blur' : '')
                        }
                    >
                        <ScrollTableCore
                            elements={sponsorships}
                            columns={[
                                {
                                    displayName: 'Stream ID',
                                    valueMapper: (element) => (
                                        <StreamInfoCell>
                                            <span className="stream-id">
                                                {truncateStreamName(element.streamId)}
                                            </span>
                                            {element.streamDescription && (
                                                <span className="stream-description">
                                                    {element.streamDescription}
                                                </span>
                                            )}
                                        </StreamInfoCell>
                                    ),
                                    align: 'start',
                                    isSticky: true,
                                    key: 'streamInfo',
                                },
                                {
                                    displayName: 'DATA/day',
                                    valueMapper: (element) => element.DATAPerDay,
                                    align: 'start',
                                    isSticky: false,
                                    key: 'dataPerDay',
                                },
                                {
                                    displayName: 'Operators',
                                    valueMapper: (element) => element.operators,
                                    align: 'end',
                                    isSticky: false,
                                    key: 'operators',
                                },
                                {
                                    displayName: 'Staked',
                                    valueMapper: (element) =>
                                        truncateNumber(
                                            Number(element.totalStake),
                                            'thousands',
                                        ),
                                    align: 'end',
                                    isSticky: false,
                                    key: 'staked',
                                },
                                {
                                    displayName: 'APY',
                                    valueMapper: (element) => element.apy + '%',
                                    align: 'end',
                                    isSticky: false,
                                    key: 'apy',
                                },
                            ]}
                            actions={[
                                {
                                    displayName: 'Edit',
                                    callback: (element) =>
                                        console.log('editing! ' + element.streamId),
                                },
                            ]}
                        />
                    </div>
                    {isMounted() && !walletConnected && (
                        <WalletNotConnectedOverlay summaryTitle="sponsorships" />
                    )}
                </>
            ) : (
                <NoData
                    firstLine="You don't have any sponsorships yet."
                    secondLine={
                        <span>
                            You can{' '}
                            <Link to={routes.network.operators()}>
                                start a sponsorship
                            </Link>{' '}
                            here
                        </span>
                    }
                />
            )}
        </SummaryContainer>
    )
}
