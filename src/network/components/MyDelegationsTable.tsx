import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWalletAccount } from '~/shared/stores/wallet'
import {
    SummaryContainer,
    WalletNotConnectedOverlay,
} from '~/network/components/NetworkUtils'
import { NetworkSectionTitle } from '~/network/components/NetworkSectionTitle'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import { HubAvatar } from '~/shared/components/AvatarImage'
import { COLORS, MEDIUM } from '~/shared/utils/styled'
import useIsMounted from '~/shared/hooks/useIsMounted'
import { truncate } from '~/shared/utils/text'
import { truncateNumber } from '~/shared/utils/truncateNumber'
import { WhiteBoxSeparator } from '~/shared/components/WhiteBox'
import { NoData } from '~/shared/components/NoData'
import routes from '~/routes'
import { Delegation } from '../types/delegations'

const hardcodedAddresses = [
    '0x12e567661643698e7C86D3684e391D2C38950C0c',
    '0xc94E24B76DF0cF39af431c8569Ee2D45a032d680',
    '0xD59eC6CBFBe2Ee9C9c75ED7732d58d0FBeb99c1c',
    '0x304B171463A828577a39155923bbDb09c227C588',
    '0x91993A3dDD95e8b84E49B42ca1B0BA222B78477E',
    '0xAe755C61Ca8707Ca01f3EdC634C4dA5B8DA5127D',
    '0x86BBe0a84c68b2607C0830DFcDC11B7F9C880bEd',
    '0x4178812b528f88bf0B2e73EB6ba4f0C8c4cd186c',
    '0x93A717001d29cA011449C6CA1e5042c285c12f37',
]

const hardcodedData: Delegation[] = hardcodedAddresses.map((address) => {
    return {
        operatorId: address,
        apy: Math.round(40 * Math.random()),
        myShare: Math.round(3500000 * Math.random()),
        operatorsCut: Math.round(30 * Math.random()),
        sponsorships: Math.round(25 * Math.random()),
        totalStake: Math.round(15000000 * Math.random()),
    }
})

export const MyDelegationsTable: FunctionComponent = () => {
    const isMounted = useIsMounted()
    const walletConnected = !!useWalletAccount()
    const hasDelegations = true // todo fetch from state

    const delegations: Delegation[] = hardcodedData // todo fetch from state
    return (
        <SummaryContainer>
            <div className="title">
                <NetworkSectionTitle>My delegations</NetworkSectionTitle>
            </div>
            <WhiteBoxSeparator />
            {hasDelegations ? (
                <>
                    <div
                        className={
                            'summary-container ' +
                            (isMounted() && !walletConnected ? 'blur' : '')
                        }
                    >
                        <ScrollTableCore
                            elements={delegations}
                            columns={[
                                {
                                    displayName: 'Operator ID',
                                    valueMapper: (element) => (
                                        <OperatorCell>
                                            <HubAvatar id={element.operatorId} />{' '}
                                            {truncate(element.operatorId)}
                                        </OperatorCell>
                                    ),
                                    align: 'start',
                                    isSticky: true,
                                    key: 'operatorId',
                                },
                                {
                                    displayName: 'My share',
                                    valueMapper: (element) =>
                                        truncateNumber(element.myShare, 'thousands'),
                                    align: 'start',
                                    isSticky: false,
                                    key: 'myShare',
                                },
                                {
                                    displayName: 'Total stake',
                                    valueMapper: (element) =>
                                        truncateNumber(element.totalStake, 'thousands'),
                                    align: 'end',
                                    isSticky: false,
                                    key: 'totalStake',
                                },
                                {
                                    displayName: "Operator's cut",
                                    valueMapper: (element) => element.operatorsCut + '%',
                                    align: 'end',
                                    isSticky: false,
                                    key: 'operatorsCut',
                                },
                                {
                                    displayName: 'APY',
                                    valueMapper: (element) => element.apy + '%',
                                    align: 'end',
                                    isSticky: false,
                                    key: 'apy',
                                },
                                {
                                    displayName: 'Sponsorships',
                                    valueMapper: (element) => element.sponsorships,
                                    align: 'end',
                                    isSticky: false,
                                    key: 'sponsorships',
                                },
                            ]}
                            actions={[
                                {
                                    displayName: 'Edit',
                                    callback: (element) =>
                                        console.warn('editing! ' + element.operatorId),
                                },
                            ]}
                        />
                    </div>
                    {isMounted() && !walletConnected && (
                        <WalletNotConnectedOverlay summaryTitle="delegations" />
                    )}
                </>
            ) : (
                <NoData
                    firstLine="You don't have any delegations yet."
                    secondLine={
                        <span>
                            Please find{' '}
                            <Link to={routes.network.operators()}>Operators</Link> to
                            start delegation
                        </span>
                    }
                />
            )}
        </SummaryContainer>
    )
}
const OperatorCell = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: ${MEDIUM};
    color: ${COLORS.primary};
`
