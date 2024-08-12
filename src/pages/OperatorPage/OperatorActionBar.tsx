import { useQuery } from '@tanstack/react-query'
import React, { FunctionComponent } from 'react'
import {
    ActionBarButton,
    ActionBarButtonCaret,
    ActionBarButtonInnerBody,
    ActionBarWalletDisplay,
} from '~/components/ActionBars/ActionBarButton'
import { Button } from '~/components/Button'
import { SimpleDropdown } from '~/components/SimpleDropdown'
import {
    useDelegateFunds,
    useIsDelegatingFundsToOperator,
    useIsUndelegatingFundsToOperator,
    useUndelegateFunds,
} from '~/hooks/operators'
import { PencilIcon } from '~/icons'
import { AboutOperator } from '~/pages/OperatorPage/AboutOperator'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { getOperatorDelegationAmount } from '~/services/operators'
import SvgIcon from '~/shared/components/SvgIcon'
import { useWalletAccount } from '~/shared/stores/wallet'
import { useCurrentChainId, useCurrentChainSymbolicName } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'
import { AbstractActionBar } from '../../components/ActionBars/AbstractActionBar'
import { OperatorAvatar } from '../../components/avatars'

export const OperatorActionBar: FunctionComponent<{
    operator: ParsedOperator
    handleEdit: (operator: ParsedOperator) => void
}> = ({ operator, handleEdit }) => {
    const walletAddress = useWalletAccount()

    const canEdit = !!walletAddress && walletAddress == operator.owner

    const isDelegatingFunds = useIsDelegatingFundsToOperator(operator.id, walletAddress)

    const delegateFunds = useDelegateFunds()

    const isUndelegatingFunds = useIsUndelegatingFundsToOperator(
        operator.id,
        walletAddress,
    )

    const undelegateFunds = useUndelegateFunds()

    const currentChainId = useCurrentChainId()

    const chainName = useCurrentChainSymbolicName()

    const canUndelegateQuery = useQuery({
        queryKey: [
            'operatorActionBar',
            currentChainId,
            operator.id,
            walletAddress?.toLowerCase(),
        ],
        async queryFn() {
            try {
                if (!operator.id || !walletAddress) {
                    return false
                }

                return (
                    (await getOperatorDelegationAmount(
                        currentChainId,
                        operator.id,
                        walletAddress,
                    )) > 0n
                )
            } catch (e) {
                console.warn(
                    'Failed to load delegation amount',
                    operator.id,
                    walletAddress,
                    e,
                )
            }

            return null
        },
    })

    const canUndelegate = !!canUndelegateQuery.data

    const { metadata } = operator

    const [delegateLabel, undelegateLabel] =
        walletAddress?.toLowerCase() === operator.owner
            ? ['Fund', 'Withdraw']
            : ['Delegate', 'Undelegate']

    return (
        <AbstractActionBar
            fallbackBackButtonUrl={R.operators(routeOptions(chainName))}
            title={
                <>
                    <OperatorAvatar
                        imageUrl={metadata.imageUrl}
                        operatorId={operator.id}
                    />
                    <span>{metadata.name || operator.id}</span>
                </>
            }
            buttons={
                <>
                    {canEdit && (
                        <ActionBarButton onClick={() => void handleEdit(operator)}>
                            <strong>Edit Operator</strong>
                            <PencilIcon />
                        </ActionBarButton>
                    )}
                    <SimpleDropdown menu={<AboutOperator operator={operator} />}>
                        {(toggle, isOpen) => (
                            <ActionBarButton
                                active={isOpen}
                                onClick={() => void toggle((c) => !c)}
                            >
                                <ActionBarButtonInnerBody>
                                    <SvgIcon name="page" />
                                    <strong>About Operator</strong>
                                </ActionBarButtonInnerBody>
                                <ActionBarButtonCaret $invert={isOpen} />
                            </ActionBarButton>
                        )}
                    </SimpleDropdown>
                    <ActionBarWalletDisplay address={operator.id} label="Operator" />
                </>
            }
            ctas={
                <>
                    <Button
                        onClick={() => {
                            delegateFunds({
                                chainId: currentChainId,
                                operator,
                                wallet: walletAddress,
                                onDone: () => {
                                    canUndelegateQuery.refetch()
                                },
                            })
                        }}
                        disabled={!walletAddress || operator.contractVersion === 1} // Operator contract v1 has a bug so we need to disable delegation
                        waiting={isDelegatingFunds}
                    >
                        {delegateLabel}
                    </Button>
                    <Button
                        onClick={() => {
                            undelegateFunds({
                                chainId: currentChainId,
                                operator,
                                wallet: walletAddress,
                            })
                        }}
                        disabled={!canUndelegate}
                        waiting={isUndelegatingFunds}
                    >
                        {undelegateLabel}
                    </Button>
                </>
            }
        />
    )
}
