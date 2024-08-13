import React from 'react'
import styled from 'styled-components'
import ColoredBox from '~/components/ColoredBox'
import { CopyButton } from '~/components/CopyButton'
import { FallbackImage } from '~/components/FallbackImage'
import { LayoutColumn } from '~/components/Layout'
import { Separator } from '~/components/Separator'
import { ParsedOperator } from '~/parsers/OperatorParser'
import Identicon from '~/shared/components/AvatarImage/Identicon'
import { COLORS } from '~/shared/utils/styled'
import { truncate } from '~/shared/utils/text'

interface OperatorDetailsProps {
    operator: ParsedOperator
}

export function OperatorDetails({ operator }: OperatorDetailsProps) {
    const { metadata } = operator

    return (
        <OperatorDetailsRoot>
            <LayoutColumn>
                <ColoredBox $backgroundColor={COLORS.Text}>
                    <OuterWrap>
                        <OperatorAvatarWrap>
                            <div>
                                <FallbackImage
                                    alt={operator.id}
                                    src={metadata.imageUrl || ''}
                                    placeholder={
                                        <Identicon id={operator.id} size={400} />
                                    }
                                />
                            </div>
                        </OperatorAvatarWrap>
                        <OperatorMetadataWrap>
                            <InnerWrap>
                                <h2>{metadata.name || operator.id}</h2>
                                <div>
                                    <p>{metadata.description}</p>
                                </div>
                            </InnerWrap>
                            <Addresses>
                                <AddressDisplay
                                    label="Owner wallet"
                                    value={operator.owner}
                                />
                                <Separator />
                                <AddressDisplay
                                    label={`Operator contract (v${operator.contractVersion})`}
                                    value={operator.id}
                                />
                            </Addresses>
                        </OperatorMetadataWrap>
                    </OuterWrap>
                </ColoredBox>
            </LayoutColumn>
        </OperatorDetailsRoot>
    )
}

const OperatorDetailsRoot = styled.div`
    background: ${COLORS.Background};
    padding-top: 32px;

    ${ColoredBox} {
        color: ${COLORS.Background};
    }

    h2 {
        margin: 0;
    }

    p {
        margin: 0;
    }
`

const OuterWrap = styled.div`
    display: flex;
    gap: 40px;
    padding: 40px;
`

const OperatorAvatarWrap = styled.div`
    max-width: 348px;
    width: 30%;

    > div {
        align-items: center;
        display: flex;
        justify-content: center;
        aspect-ratio: 1 / 1;
        background: #000000;
        border-radius: 10px;
        overflow: hidden;
    }

    img {
        max-width: 100%;
        display: block;
    }
`

const OperatorMetadataWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
`

const InnerWrap = styled.div`
    flex-grow: 1;

    h2 {
        margin-bottom: 16px;
    }
`

const InlineAddressesMq = '(min-width: 832px)'

const Addresses = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;

    ${Separator} {
        background: #525252;
        display: none;
        height: 48px;
        width: 1px;
    }

    @media ${InlineAddressesMq} {
        align-items: center;
        flex-direction: row;
        gap: 48px;

        ${Separator} {
            display: block;
        }
    }
`

const AddressDisplayRoot = styled.div``

const AddressDisplayLabel = styled.div`
    color: #a3a3a3;
    font-size: 14px;
    letter-spacing: 0.01em;
    line-height: normal;
`

const AddressDisplayValue = styled.div`
    align-items: center;
    display: flex;
    font-size: 20px;
    gap: 12px;
    letter-spacing: 0.01em;
    line-height: normal;
    margin-top: 6px;
`

interface AddressDisplayProps {
    label: string
    value: string
}

function AddressDisplay({ label, value }: AddressDisplayProps) {
    return (
        <AddressDisplayRoot>
            <AddressDisplayLabel>{label}</AddressDisplayLabel>
            <AddressDisplayValue>
                <div>{truncate(value)}</div>
                <CopyButton value={value} />
            </AddressDisplayValue>
        </AddressDisplayRoot>
    )
}
