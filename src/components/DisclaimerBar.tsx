import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import LightModal, { ModalProps } from '~/modals/LightModal'
import SvgIcon from '~/shared/components/SvgIcon'
import { DESKTOP, TABLET } from '~/shared/utils/styled'
import { Layer } from '~/utils/Layer'

const DisclaimerModal = (props: ModalProps) => <LightModal {...props} />

export const DisclaimerBar = () => {
    const { pathname } = useLocation()

    // Show disclaimer only for Overview, Sponsorships, Sponsorship, Operators, Operator pages
    if (!pathname.includes('/hub/network/')) {
        return null
    }

    return (
        <Root>
            <SvgIcon name="infoBadge" />
            <div>
                Streamr risk disclaimer: The sponsorship, staking & delegation smart
                contracts are unproven technology, participate at your own risk.{' '}
                <a
                    onClick={async () => {
                        try {
                            await toaster(DisclaimerModal, Layer.Modal).pop({
                                title: 'Disclaimer',
                                children: (
                                    <p>
                                        The Streamr 1.0 testnets involve new, unproven
                                        technology including smart contracts and new
                                        protocols, which contain inherent risks. Users
                                        should conduct thorough research before engaging,
                                        and participate at their own risk. Participation
                                        can result in irreversible loss of funds. Exercise
                                        caution. Never share your private key with anyone.{' '}
                                        <a
                                            href="https://docs.streamr.network/streamr-testnets/testnets"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Learn more
                                        </a>
                                        .
                                    </p>
                                ),
                            })
                        } catch (e) {}
                    }}
                >
                    Learn more
                </a>
                .
            </div>
        </Root>
    )
}

const Root = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    width: 100%;
    padding: 12px 72px 12px 40px;
    align-items: center;
    justify-content: left;
    color: white;
    background: #323232;
    font-size: 14px;
    font-weight: 400;
    line-height: normal;

    padding: 12px 72px 12px 24px;

    @media (${TABLET}) {
        padding: 12px 72px 12px 24px;
    }

    @media (${DESKTOP}) {
        padding: 12px 72px 12px 40px;
    }

    // Make it stick to top
    position: sticky;
    top: 0;
    z-index: 1000;

    & > svg {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        & circle {
            fill: #525252;
        }
    }

    & a {
        text-decoration: underline !important;
        cursor: pointer;
    }
`
