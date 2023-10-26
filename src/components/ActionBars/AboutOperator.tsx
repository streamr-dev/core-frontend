import React from 'react'
import InfoIcon from '@atlaskit/icon/glyph/info'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { DefaultSimpleDropdownMenu } from '~/components/SimpleDropdown'
import { Address, Banner, IconWrap } from '~/components/ActionBars/AboutEntity'
import { truncate } from '~/shared/utils/text'
import useCopy from '~/shared/hooks/useCopy'
import { CopyIcon } from '~/icons'
import { IconButton } from '~/components/IconButton'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'

export function AboutOperator({ operator }: { operator: ParsedOperator }) {
    const {
        owner,
        metadata: { description },
    } = operator

    const { copy } = useCopy()

    return (
        <DefaultSimpleDropdownMenu>
            {(description || null) && <p>{description}</p>}
            <Address>
                <div>
                    Owner wallet address: <strong>{truncate(owner)}</strong>
                </div>
                <div>
                    <IconButton type="button" onClick={() => void copy(owner)}>
                        <CopyIcon />
                    </IconButton>
                </div>
            </Address>
            <Banner>
                <IconWrap>
                    <InfoIcon label="Info" />
                </IconWrap>
                <div>
                    <p>
                        Operators secure and stabilize the Streamr Network by running
                        nodes and contributing bandwidth. In exchange, they earn{' '}
                        <SponsorshipPaymentTokenName /> tokens from sponsorships they
                        stake on. The stake guarantees that the operators do the work,
                        otherwise they get slashed.
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
