import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import React, { ButtonHTMLAttributes, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import { Button } from '~/components/Button'
import { Separator } from '~/components/Separator'
import Spinner from '~/components/Spinner'
import { Tooltip, TooltipIconWrap } from '~/components/Tooltip'
import AddAddressModal from '~/modals/AddAddressModal'
import {
    addOperatorControllerAddress,
    removeOperatorControllerAddress,
    setOperatorNodeAddresses,
} from '~/services/operators'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import { COLORS } from '~/shared/utils/styled'
import { Layer } from '~/utils/Layer'
import { getBalance } from '~/utils/balance'
import { toBigInt, toFloat } from '~/utils/bn'
import { useCurrentChainId } from '~/utils/chains'
import { isRejectionReason, isTransactionRejection } from '~/utils/exceptions'
import { errorToast } from '~/utils/toast'

export interface AddressItem {
    address: string
    enabled: boolean
    persisted: boolean
}

export enum AddressType {
    Node,
    Automation,
}

const dialogTitleMap: Record<AddressType, string> = {
    [AddressType.Node]: 'Add node address',
    [AddressType.Automation]: 'Authorise staking agent',
}

const dialogSubmitLabelMap: Record<AddressType, string> = {
    [AddressType.Node]: 'Add node address',
    [AddressType.Automation]: 'Authorise staking agent',
}

export function AddressTable({
    type,
    busy = false,
    disableEditing = false,
    onChange,
    onAddAddress,
    onRemoveAddress,
    value = [],
}: {
    type: AddressType
    busy?: boolean
    disableEditing?: boolean
    onChange?: (value: AddressItem[]) => void
    onAddAddress?: (address: string) => void
    onRemoveAddress?: (address: string) => void
    value?: AddressItem[]
}) {
    function toggle(element: AddressItem) {
        if (element.persisted) {
            return void onChange?.(
                value.map((node) =>
                    node !== element ? node : { ...node, enabled: !node.enabled },
                ),
            )
        }

        onChange?.(value.filter((node) => node !== element))
    }

    return (
        <ScrollTable
            elements={value}
            columns={[
                {
                    displayName: 'Address',
                    valueMapper: (element) => (
                        <Address $new={element.enabled && !element.persisted}>
                            {element.address}
                        </Address>
                    ),
                    align: 'start',
                    isSticky: true,
                    key: 'id',
                },
                {
                    displayName: 'POL balance',
                    valueMapper: (element) => <PolBalance address={element.address} />,
                    align: 'start',
                    isSticky: false,
                    key: 'balance',
                },
                {
                    displayName: '',
                    valueMapper: (element) => (
                        <>
                            {element.persisted !== element.enabled ? (
                                <PendingIndicator disabled={busy}>
                                    Pending {element.enabled ? 'addition' : 'deletion'}
                                </PendingIndicator>
                            ) : (
                                <Button
                                    disabled={busy || disableEditing}
                                    kind="secondary"
                                    onClick={() => {
                                        toggle(element)
                                        return void onRemoveAddress?.(element.address)
                                    }}
                                >
                                    Delete
                                </Button>
                            )}
                        </>
                    ),
                    align: 'end',
                    isSticky: false,
                    key: 'actions',
                },
            ]}
            footerComponent={
                <Footer>
                    <Button
                        kind="secondary"
                        disabled={busy || disableEditing}
                        onClick={async () => {
                            try {
                                await addAddressModal.pop({
                                    title: dialogTitleMap[type],
                                    submitLabel: dialogSubmitLabelMap[type],
                                    warning:
                                        type === AddressType.Automation ? (
                                            <>
                                                While this address cannot withdraw your
                                                tokens, it may trigger penalties for your
                                                Operator by engaging in unsuitable
                                                Sponsorships or prematurely exiting
                                                Sponsorships before the minimum stake
                                                period expires. It&apos;s important to
                                                exercise caution.
                                            </>
                                        ) : undefined,
                                    async onSubmit(newAddress) {
                                        const address = `0x${newAddress.replace(
                                            /^0x/i,
                                            '',
                                        )}`.toLowerCase()

                                        const exists = value.some(
                                            (node) =>
                                                node.address.toLowerCase() === address,
                                        )

                                        if (!exists) {
                                            onChange?.([
                                                ...value,
                                                {
                                                    address,
                                                    persisted: false,
                                                    enabled: true,
                                                },
                                            ])

                                            return void onAddAddress?.(address)
                                        }

                                        errorToast({
                                            title: 'Address already declared',
                                        })
                                    },
                                })
                            } catch (e) {
                                if (isRejectionReason(e)) {
                                    return
                                }

                                console.warn('Failed to add address', e)
                            }
                        }}
                    >
                        {dialogTitleMap[type]}
                    </Button>
                </Footer>
            }
        />
    )
}

const Address = styled.div<{ $new?: boolean }>`
    color: ${({ $new = false }) => ($new ? '#a3a3a3' : '#525252')};
`

const addAddressModal = toaster(AddAddressModal, Layer.Modal)

const Footer = styled.div`
    display: flex;
    justify-content: right;
    padding: 32px;
    gap: 10px;
`

const LowBalanceThreshold = toBigInt(0.1, 18n)

function PolBalance({ address }: { address: string }) {
    const [balance, setBalance] = useState<bigint>()

    const currentChainId = useCurrentChainId()

    useEffect(() => {
        let mounted = true

        void (async () => {
            try {
                const newBalance = await getBalance({
                    chainId: currentChainId,
                    tokenAddress: 'native',
                    walletAddress: address,
                })

                if (mounted) {
                    setBalance(newBalance)
                }
            } catch (e) {
                console.warn(`Failed to get balance for "${address}"`, e)
            }
        })()

        return () => {
            mounted = false
        }
    }, [address, currentChainId])

    const lowBalance = balance != null && balance < LowBalanceThreshold

    return balance != null ? (
        <PolBalanceRoot>
            <div>{toFloat(balance, 18n).toFixed(2)}</div>
            {lowBalance && (
                <Tooltip content="Low POL">
                    <TooltipIconWrap
                        className="ml-1"
                        $color="#ff5c00"
                        $svgSize={{ width: '18px', height: '18px' }}
                    >
                        <JiraFailedBuildStatusIcon label="Error" />
                    </TooltipIconWrap>
                </Tooltip>
            )}
        </PolBalanceRoot>
    ) : (
        <Spinner color="blue" />
    )
}

const PolBalanceRoot = styled.div`
    align-items: center;
    display: flex;
    gap: 8px;

    > * {
        flex-shrink: 0;
    }
`

function PendingIndicator({
    children,
    ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>) {
    return (
        <PendingIndicatorRoot {...props} type="button">
            <div>{children}</div>
            <Separator />
            <div>
                <Spinner color="blue" />
            </div>
        </PendingIndicatorRoot>
    )
}

const PendingIndicatorRoot = styled.button`
    align-items: center;
    appearance: none;
    background: #deebff;
    border-radius: 4px;
    border: 0;
    color: ${COLORS.primary};
    display: grid;
    font-size: 12px;
    font-weight: 500;
    grid-template-columns: auto 1px 24px;
    height: 32px;
    line-height: 20px;
    padding: 0;

    :disabled {
        opacity: 0.5;
    }

    ${Separator} {
        background: #d1dfff;
        height: 100%;
    }

    > div:first-child {
        padding: 0 8px;
    }

    svg {
        color: ${COLORS.close};
        display: block;
        height: 8px;
        margin: 0 auto;
        width: 8px;
    }

    ${Spinner} {
        height: 8px;
        width: 8px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-items: center;
    }
`

type SubmitNodeAddressesCallback = (
    chainId: number,
    operatorId: string,
    addresses: string[],
    options?: {
        onSuccess?: (blockNumber: number) => void
        onError?: (e: unknown) => void
        onReject?: () => void
    },
) => Promise<void>

export function useSubmitNodeAddressesCallback(): [SubmitNodeAddressesCallback, boolean] {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const cb: SubmitNodeAddressesCallback = useCallback(
        async (chainId, operatorId, addresses, { onSuccess, onError, onReject } = {}) => {
            setIsSubmitting(true)

            try {
                await setOperatorNodeAddresses(chainId, operatorId, addresses, {
                    onReceipt: ({ blockNumber }) => {
                        onSuccess?.(blockNumber)
                    },
                })
            } catch (e) {
                if (isTransactionRejection(e) || isRejectionReason(e)) {
                    /**
                     * User rejected the transaction. Let's move on like
                     * nothing happened.
                     */
                    onReject?.()

                    return
                }

                console.warn('Failed to save the node addresses', e)

                onError?.(e)
            } finally {
                setIsSubmitting(false)
            }
        },
        [],
    )

    return [cb, isSubmitting]
}

type SubmitControllerAddressesCallback = (
    chainId: number,
    operatorId: string,
    address: string,
    addNew: boolean,
    options?: {
        onSuccess?: (blockNumber: number) => void
        onError?: (e: unknown) => void
        onReject?: () => void
    },
) => Promise<void>

export function useSubmitControllerAddressesCallback(): [
    SubmitControllerAddressesCallback,
    boolean,
] {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const cb: SubmitControllerAddressesCallback = useCallback(
        async (
            chainId,
            operatorId,
            address,
            addNew,
            { onSuccess, onError, onReject } = {},
        ) => {
            setIsSubmitting(true)

            try {
                if (addNew) {
                    await addOperatorControllerAddress(chainId, operatorId, address, {
                        onReceipt: ({ blockNumber }) => {
                            onSuccess?.(blockNumber)
                        },
                    })
                } else {
                    await removeOperatorControllerAddress(chainId, operatorId, address, {
                        onReceipt: ({ blockNumber }) => {
                            onSuccess?.(blockNumber)
                        },
                    })
                }
            } catch (e) {
                if (isTransactionRejection(e) || isRejectionReason(e)) {
                    /**
                     * User rejected the transaction. Let's move on like
                     * nothing happened.
                     */
                    onReject?.()

                    return
                }

                console.warn('Failed to save the controller addresses', e)

                onError?.(e)
            } finally {
                setIsSubmitting(false)
            }
        },
        [],
    )

    return [cb, isSubmitting]
}
