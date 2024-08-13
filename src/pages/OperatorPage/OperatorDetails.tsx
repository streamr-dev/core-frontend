import React from 'react'
import styled, { css } from 'styled-components'
import { Buttonesque } from '~/components/Button'
import ColoredBox from '~/components/ColoredBox'
import { CopyButton } from '~/components/CopyButton'
import { FallbackImage } from '~/components/FallbackImage'
import { LayoutColumn } from '~/components/Layout'
import { Separator } from '~/components/Separator'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { Tooltip } from '~/components/Tooltip'
import { ParsedOperator } from '~/parsers/OperatorParser'
import Identicon from '~/shared/components/AvatarImage/Identicon'
import { useWalletAccount } from '~/shared/stores/wallet'
import { COLORS, DESKTOP, MEDIUM, TABLET } from '~/shared/utils/styled'
import { truncate } from '~/shared/utils/text'
import { saveOperator } from '~/utils'
import { useCurrentChainId } from '~/utils/chains'

interface OperatorDetailsProps {
    operator: ParsedOperator
}

export function OperatorDetails({ operator }: OperatorDetailsProps) {
    const { metadata } = operator

    const chainId = useCurrentChainId()

    const walletAddress = useWalletAccount()

    const canEdit = !!walletAddress && walletAddress == operator.owner

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
                            <InnerWrap $noDesc={!metadata.description}>
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
                    <Actions>
                        <CtaWrap>
                            {canEdit && (
                                <Buttonesque
                                    onClick={() => saveOperator(chainId, operator)}
                                    $css={css`
                                        --border: 1px solid currentColor;
                                        --borderRadius: 4px;
                                        --hoverBorder: 1px solid #ffffff;
                                        --color: #a3a3a3;
                                        --hoverColor: #ffffff;

                                        display: flex;
                                        padding: 0 10px;
                                    `}
                                >
                                    Edit operator
                                </Buttonesque>
                            )}
                        </CtaWrap>
                        <div>
                            <Tooltip
                                content={
                                    <p>
                                        Operators run Streamr nodes that contribute
                                        bandwidth to&nbsp;the Streamr Network. Operators
                                        earn <SponsorshipPaymentTokenName /> tokens
                                        by&nbsp;staking on Sponsorships.
                                    </p>
                                }
                            >
                                <InfoWrap>
                                    <svg
                                        width="20"
                                        height="21"
                                        viewBox="0 0 20 21"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            // eslint-disable-next-line max-len
                                            d="M10 0.958009C4.47715 0.958009 -1.35705e-06 5.43516 -8.74228e-07 10.958C-3.91405e-07 16.4809 4.47715 20.958 10 20.958C15.5228 20.958 20 16.4809 20 10.958C20 5.43516 15.5228 0.958008 10 0.958009Z"
                                            fill="#525252"
                                        />
                                        <path
                                            d="M10 9.39648L10 15.958"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M10 6.39648L10 6.44763"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </InfoWrap>
                            </Tooltip>
                        </div>
                    </Actions>
                </ColoredBox>
            </LayoutColumn>
        </OperatorDetailsRoot>
    )
}

const InfoWrap = styled.div`
    padding: 4px;
    pointer-events: auto;
`

const Actions = styled.div`
    align-items: center;
    border-top: 1px solid #525252;
    box-sizing: content-box;
    display: flex;
    height: 32px;
    padding: 16px;
    pointer-events: none;

    @media ${DESKTOP} {
        border: 0;
        padding: 24px;
        position: absolute;
        right: 0;
        flex-direction: column;
        top: 0;
        align-items: end;
        height: 100%;
        box-sizing: border-box;
    }
`

const CtaWrap = styled.div`
    flex-grow: 1;

    ${Buttonesque} {
        pointer-events: auto;
    }
`

const OperatorDetailsRoot = styled.div`
    background: ${COLORS.Background};
    padding-top: 32px;

    ${ColoredBox} {
        color: ${COLORS.Background};
        position: relative;
    }
`

const SideImageMq = '(min-width: 660px)'

const OuterWrap = styled.div`
    padding: 20px;
    margin: 0 auto;

    @media ${SideImageMq} {
        display: flex;
        gap: 20px;
        max-width: none;
    }

    @media ${TABLET} {
        padding: 24px;
        gap: 24px;
    }

    @media ${DESKTOP} {
        padding: 40px;
        gap: 40px;
    }
`

const OperatorAvatarWrap = styled.div`
    flex-shrink: 0;

    @media ${SideImageMq} {
        margin: 0 auto;
        max-width: 348px;
        width: 30%;
    }

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
    margin-top: 24px;
    min-width: 0;

    @media ${SideImageMq} {
        margin: 0;
    }
`

const InnerWrap = styled.div<{ $noDesc?: boolean }>`
    flex-grow: 1;

    h2 {
        font-size: 24px;
        font-weight: ${MEDIUM};
        letter-spacing: 0.01em;
        line-height: 30px;
        margin-bottom: 16px;
    }

    @media ${SideImageMq} {
        h2 + div {
            padding-right: 112px;
        }
    }

    h2 {
        display: none;
    }

    p {
        margin: 0;
        line-height: 1.5em;
        word-wrap: break-word;
    }

    ${({ $noDesc = false }) =>
        $noDesc &&
        css`
            display: none;
        `}

    @media ${TABLET} {
        display: block;

        h2 {
            display: block;
        }
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
