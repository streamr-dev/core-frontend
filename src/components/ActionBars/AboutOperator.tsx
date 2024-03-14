import React from 'react'
import InfoIcon from '@atlaskit/icon/glyph/info'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { DefaultSimpleDropdownMenu } from '~/components/SimpleDropdown'
import {
    Address,
    AddressContent,
    AddressLabel,
    Banner,
    IconWrap,
} from '~/components/ActionBars/AboutEntity'
import { truncate } from '~/shared/utils/text'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { CopyButton } from '~/components/CopyButton'

export function AboutOperator({ operator }: { operator: ParsedOperator }) {
    const {
        owner,
        metadata: { description },
    } = operator

    return (
        <DefaultSimpleDropdownMenu>
            {(description || null) && <p>{description}</p>}
            <Address>
                <AddressLabel>Owner wallet address:</AddressLabel>
                <AddressContent>
                    <strong>{truncate(owner)}</strong>
                    <div>
                        <CopyButton value={owner} />
                    </div>
                </AddressContent>
            </Address>
            <Address>
                <AddressLabel>Operator smart contract version:</AddressLabel>
                <AddressContent>
                    <strong>{operator.contractVersion}</strong>
                </AddressContent>
            </Address>
            <Banner>
                <IconWrap>
                    <InfoIcon label="Info" />
                </IconWrap>
                <div>
                    <p>
                        Operators run Streamr nodes that contribute bandwidth to&nbsp;the
                        Streamr Network. Operators earn <SponsorshipPaymentTokenName />{' '}
                        tokens by&nbsp;staking on Sponsorships.
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
