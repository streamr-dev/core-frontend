import React, { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import Button from '$shared/components/Button'
import NetworkIcon from '$shared/components/NetworkIcon'
import { MEDIUM } from '$shared/utils/styled'
import { getConfigForChain } from '$shared/web3/config'
import { formatChainName } from '$shared/utils/chains'
import useIsMounted from '$shared/hooks/useIsMounted'
import { fetchGraphProjectPaymentDetails } from '$utils/fetchers'
import { getCustomTokenBalance, getTokenInformation } from '$mp/utils/web3'
import { getUsdRate } from '$shared/utils/coingecko'
import ProjectModal, { Actions, RejectionReason } from './ProjectModal'

const ChainIcon = styled(NetworkIcon)`
    width: 40px;
    height: 40px;
`

const ChainName = styled.span`
    font-size: 18px;
    line-height: normal;
    font-weight: ${MEDIUM};
`

const Form = styled.form`
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }
`

const Item = styled.label<{ $selected?: boolean }>`
    align-items: center;
    background: #ffffff;
    border: 2px solid #ffffff;
    border-radius: 8px;
    display: grid;
    gap: 12px;
    grid-template-columns: auto 1fr auto;
    padding: 20px;
    width: 100%;
    cursor: pointer;
    transition: 200ms border-color;
    user-select: none;

    ${({ $selected = false }) =>
        $selected &&
        css`
            border-color: #b3d4ff;
        `}
`

const Radio = styled.div<{ $selected?: boolean }>`
    width: 20px;
    height: 20px;
    border: 2px solid #cdcdcd;
    border-radius: 100%;
    transition: 200ms ease-in-out border-color;

    ::before {
        background: #0324ff;
        border-radius: 100%;
        content: '';
        display: block;
        height: 12px;
        opacity: 0;
        margin: 2px 0 0 2px;
        transform: translateZ(0) scale(0.5);
        transition: 200ms ease-in-out;
        transition-property: transform, opacity;
        width: 12px;
    }

    ${({ $selected = false }) =>
        $selected &&
        css`
            border-color: #0324ff;

            ::before {
                opacity: 1;
                transform: translateZ(0) scale(1);
            }
        `}
`

const Placeholder = styled.div`
    align-items: center;
    border-radius: 8px;
    display: flex;
    height: 88px;
    justify-content: center;
    width: 100%;
`

export interface ChainSelectorResult {
    chainId: number
    balance: string
    usdRate: number
    pricePerSecond: string
    tokenAddress: string
    tokenDecimals: string
    tokenSymbol: string
}

interface Props {
    projectId?: string
    onResolve?: (result: ChainSelectorResult) => void
    onReject?: (reason?: unknown) => void
    chainIds?: number[]
    selectedChainId?: number
    paymentDetails?: Awaited<ReturnType<typeof fetchGraphProjectPaymentDetails>>
    account?: string
}

export default function ProjectChainSelectorModal({
    projectId,
    chainIds = [],
    selectedChainId: selectedChainIdProp,
    paymentDetails = [],
    onReject,
    onResolve,
    account,
}: Props) {
    const [selectedChainId, selectChainId] = useState<number | undefined>(
        selectedChainIdProp,
    )

    useEffect(() => {
        selectChainId(selectedChainIdProp)
    }, [selectedChainIdProp])

    const [isSubmitting, setIsSubmitting] = useState(false)

    const disabled = !Number.isSafeInteger(selectedChainId) || isSubmitting

    /**
     * It's safe to use `useIsMounted` here because even if we rerender the component
     * for a different purchase it'll be disabled if there's one already being processed.
     */
    const isMounted = useIsMounted()

    return (
        <ProjectModal
            closeOnEscape
            onReject={onReject}
            title="Select chain for payment token"
        >
            <Form
                onSubmit={async (e) => {
                    e.preventDefault()

                    if (disabled) {
                        return
                    }

                    try {
                        setIsSubmitting(true)

                        if (typeof selectedChainId !== 'number') {
                            throw new Error('No selected chain id')
                        }

                        if (!projectId) {
                            throw new Error('No project id')
                        }

                        if (!account) {
                            throw new Error('No account')
                        }

                        const paymentDetail = paymentDetails.find(
                            ({ domainId }) => Number(domainId) === selectedChainId,
                        )

                        if (!paymentDetail) {
                            throw new Error('No matching payment detail')
                        }

                        const { pricingTokenAddress: tokenAddress, pricePerSecond } =
                            paymentDetail

                        const tokenInfo = await getTokenInformation(
                            tokenAddress,
                            selectedChainId,
                        )

                        if (!tokenInfo) {
                            throw new Error('Failed to load token information')
                        }

                        const balance = await getCustomTokenBalance(
                            tokenAddress,
                            account,
                            true,
                            selectedChainId,
                        )

                        const usdRate = await getUsdRate(tokenAddress, selectedChainId)

                        onResolve?.({
                            balance: balance.toString(),
                            chainId: selectedChainId,
                            pricePerSecond,
                            tokenAddress,
                            tokenDecimals: String(tokenInfo.decimals),
                            tokenSymbol: tokenInfo.symbol,
                            usdRate,
                        })
                    } catch (e) {
                        onReject?.(e)
                    } finally {
                        if (isMounted()) {
                            setIsSubmitting(false)
                        }
                    }
                }}
            >
                {chainIds.length ? (
                    <ul>
                        {chainIds.map((chainId) => (
                            <li key={chainId}>
                                <Item
                                    $selected={selectedChainId === chainId}
                                    onClick={() =>
                                        void selectChainId((current) =>
                                            current === chainId ? undefined : chainId,
                                        )
                                    }
                                >
                                    <ChainIcon chainId={chainId} />
                                    <ChainName>
                                        {formatChainName(getConfigForChain(chainId).name)}
                                    </ChainName>
                                    <Radio $selected={selectedChainId === chainId} />
                                </Item>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Placeholder>No available chains.</Placeholder>
                )}
                <Actions>
                    <Button
                        kind="link"
                        type="button"
                        onClick={() => void onReject?.(RejectionReason.CancelButton)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={disabled} waiting={disabled}>
                        Next
                    </Button>
                </Actions>
            </Form>
        </ProjectModal>
    )
}