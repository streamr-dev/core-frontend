import React from 'react'
import InfoIcon from '@atlaskit/icon/glyph/info'
import styled from 'styled-components'
import { Link as PrestyledLink } from 'react-router-dom'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import { DefaultSimpleDropdownMenu } from '~/components/SimpleDropdown'
import { Address, Banner, IconWrap } from '~/components/ActionBars/AboutEntity'
import { truncateStreamName } from '~/shared/utils/text'
import { ExternalLinkIcon } from '~/icons'
import routes from '~/routes'

export function AboutSponsorship({ sponsorship }: { sponsorship: ParsedSponsorship }) {
    const { streamId } = sponsorship

    return (
        <DefaultSimpleDropdownMenu>
            <Address>
                <div>
                    Sponsored stream: <strong>{truncateStreamName(streamId)}</strong>
                </div>
                <div>
                    <Link to={routes.streams.show({ id: streamId })} target="_blank">
                        <ExternalLinkIcon />
                    </Link>
                </div>
            </Address>
            <Banner>
                <IconWrap>
                    <InfoIcon label="Info" />
                </IconWrap>
                <div>
                    <p>
                        Sponsorships pay out tokens to staked operators for doing work
                        in&nbsp;the network, i.e. relaying data in the associated stream.
                        Sponsorships can be funded by anyone.
                    </p>
                    <p>
                        <a
                            href="https://docs.streamr.network/streamr-network/network-incentives"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            Learn more
                        </a>
                    </p>
                </div>
            </Banner>
        </DefaultSimpleDropdownMenu>
    )
}

const Link = styled(PrestyledLink)`
    display: block;

    :active {
        transform: translateY(1px);
    }
`
