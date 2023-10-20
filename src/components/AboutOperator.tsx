import React from 'react'
import styled from 'styled-components'
import InfoIcon from '@atlaskit/icon/glyph/info'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { COLORS } from '~/shared/utils/styled'
import { truncate } from '~/shared/utils/text'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import useCopy from '~/shared/hooks/useCopy'
import { CopyIcon } from '~/icons'
import { IconButton } from './IconButton'
import { DefaultSimpleDropdownMenu } from './SimpleDropdown'

export function AboutOperator({
    operator: {
        owner,
        metadata: { description },
    },
}: {
    operator: ParsedOperator
}) {
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

const Address = styled.p`
    align-items: center;
    color: ${COLORS.primaryLight};
    display: grid;
    gap: 4px;
    grid-template-columns: max-content auto;

    strong {
        color: ${COLORS.primary};
    }

    svg {
        display: block;
    }
`

const Banner = styled.div`
    background: ${COLORS.secondaryLight};
    border-radius: 6px;
    padding: 12px;
    display: grid;
    gap: 10px;
    grid-template-columns: 24px 1fr;
    margin-top: 20px;

    span[role='img'] {
        color: ${COLORS.primaryDisabled};
    }

    svg,
    span[role='img'] {
        display: block;
        width: 20px;
        height: 20px;
    }
`

const IconWrap = styled.div`
    align-items: center;
    display: flex;
    height: 24px;
    justify-content: center;
    width: 24px;
`
