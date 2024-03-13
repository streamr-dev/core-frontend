import React, { ButtonHTMLAttributes, useCallback, useState } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import AddAutomationAddressModal from '~/modals/AddAutomationAddressModal'
import { Layer } from '~/utils/Layer'
import { Button } from '~/components/Button'
import { COLORS } from '~/shared/utils/styled'
import SvgIcon from '~/shared/components/SvgIcon'
import { isRejectionReason, isTransactionRejection } from '~/utils/exceptions'
import { errorToast } from '~/utils/toast'
import { setOperatorNodeAddresses } from '~/services/operators'
import { Separator } from '~/components/Separator'

export interface OperatorNode {
    address: string
    enabled: boolean
    persisted: boolean
}

export function AutomationKeysTable({
    busy = false,
    onChange,
    onSaveClick,
    value = [],
}: {
    busy?: boolean
    onChange?: (value: OperatorNode[]) => void
    onSaveClick?: (addresses: string[]) => void
    value?: OperatorNode[]
}) {
    function toggle(element: OperatorNode) {
        if (element.persisted) {
            return void onChange?.(
                value.map((node) =>
                    node !== element ? node : { ...node, enabled: !node.enabled },
                ),
            )
        }

        onChange?.(value.filter((node) => node !== element))
    }

    const changed = value.some((node) => node.persisted !== node.enabled)

    return (
        <ScrollTable
            elements={value}
            columns={[
                {
                    displayName: 'Address',
                    valueMapper: (element) => (
                        <NodeAddress $new={element.enabled && !element.persisted}>
                            {element.address}
                        </NodeAddress>
                    ),
                    align: 'start',
                    isSticky: true,
                    key: 'id',
                },
                {
                    displayName: '',
                    valueMapper: (element) => (
                        <>
                            {element.persisted !== element.enabled ? (
                                <PendingIndicator
                                    disabled={busy}
                                    onClick={() => void toggle(element)}
                                >
                                    Pending {element.enabled ? 'addition' : 'deletion'}
                                </PendingIndicator>
                            ) : (
                                <Button
                                    disabled={busy}
                                    kind="secondary"
                                    onClick={() => void toggle(element)}
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
                <NodeAddressesFooter>
                    <Button
                        kind="secondary"
                        disabled={busy}
                        onClick={async () => {
                            try {
                                await addAutomationAddressModal.pop({
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
                                            return void onChange?.([
                                                ...value,
                                                {
                                                    address,
                                                    persisted: false,
                                                    enabled: true,
                                                },
                                            ])
                                        }

                                        errorToast({
                                            title: 'Automation address already declared',
                                        })
                                    },
                                })
                            } catch (e) {
                                if (isRejectionReason(e)) {
                                    return
                                }

                                console.warn('Failed to add a automation address', e)
                            }
                        }}
                    >
                        Add automation address
                    </Button>
                    <Button
                        kind="primary"
                        onClick={() => {
                            onSaveClick?.(
                                value
                                    .filter((node) => node.enabled)
                                    .map(({ address }) => address),
                            )
                        }}
                        disabled={!changed}
                        waiting={busy}
                    >
                        Save
                    </Button>
                </NodeAddressesFooter>
            }
        />
    )
}

const NodeAddress = styled.div<{ $new?: boolean }>`
    color: ${({ $new = false }) => ($new ? '#a3a3a3' : '#525252')};
`

const addAutomationAddressModal = toaster(AddAutomationAddressModal, Layer.Modal)

const NodeAddressesFooter = styled.div`
    display: flex;
    justify-content: right;
    padding: 32px;
    gap: 10px;
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
                <SvgIcon name="crossMedium" />
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
`

type SubmitNodeAddressesCallback = (
    chainId: number,
    operatorId: string,
    addresses: string[],
    options?: {
        onSuccess?: (blockNumber: number) => void
        onError?: (e: unknown) => void
    },
) => Promise<void>

export function useSubmitNodeAddressesCallback(): [SubmitNodeAddressesCallback, boolean] {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const cb: SubmitNodeAddressesCallback = useCallback(
        async (chainId, operatorId, addresses, { onSuccess, onError } = {}) => {
            setIsSubmitting(true)

            try {
                await setOperatorNodeAddresses(chainId, operatorId, addresses, {
                    onBlockNumber(blockNumber) {
                        onSuccess?.(blockNumber)
                    },
                })
            } catch (e) {
                if (isTransactionRejection(e)) {
                    /**
                     * User rejected the transaction. Let's move on like
                     * nothing happened.
                     */
                    return
                }

                console.warn('Faild to save the new node addresses', e)

                onError?.(e)
            } finally {
                setIsSubmitting(false)
            }
        },
        [],
    )

    return [cb, isSubmitting]
}
