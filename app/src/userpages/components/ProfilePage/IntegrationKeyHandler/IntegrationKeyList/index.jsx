// @flow

import React, { useCallback, useEffect, useState, useMemo } from 'react'
import cx from 'classnames'

import type { IntegrationKeyId, IntegrationKey, IntegrationKeyList as IntegrationKeyListType } from '$shared/flowtype/integration-key-types'
import type { Address } from '$shared/flowtype/web3-types'
import KeyField from '$userpages/components/KeyField'
import { getDataTokenBalance, getEthBalance } from '$mp/utils/web3'

import styles from './integrationKeyList.pcss'

function useDataBalance(address: Address) {
    const [fetching, setFetching] = useState(false)
    const [balance, setBalance] = useState(undefined)
    const [error, setError] = useState(undefined)

    const loadBalance = useCallback(async (address) => {
        setFetching(true)
        setBalance(undefined)

        try {
            const newBalance = await getDataTokenBalance(address, true)

            if (newBalance) {
                setBalance(newBalance.decimalPlaces(4).toString())
            }
        } catch (e) {
            console.warn(e)
            setError(e)
        } finally {
            setFetching(false)
        }
    }, [])

    useEffect(() => {
        if (!address) {
            return
        }

        loadBalance(address)
    }, [loadBalance, address])

    return useMemo(() => ({
        fetching,
        balance,
        error,
    }), [
        fetching,
        balance,
        error,
    ])
}

function useEthBalance(address: Address) {
    const [fetching, setFetching] = useState(false)
    const [balance, setBalance] = useState(undefined)
    const [error, setError] = useState(undefined)

    const loadBalance = useCallback(async (address) => {
        setFetching(true)
        setBalance(undefined)

        try {
            const newBalance = await getEthBalance(address, true)

            if (newBalance) {
                setBalance(newBalance.decimalPlaces(4).toString())
            }
        } catch (e) {
            console.warn(e)
            setError(e)
        } finally {
            setFetching(false)
        }
    }, [])

    useEffect(() => {
        if (!address) {
            return
        }

        loadBalance(address)
    }, [loadBalance, address])

    return useMemo(() => ({
        fetching,
        balance,
        error,
    }), [
        fetching,
        balance,
        error,
    ])
}

type CommonProps = {|
    hideValues?: boolean,
    truncateValues?: boolean,
    onDelete: (IntegrationKeyId: IntegrationKeyId) => Promise<void>,
    onEdit: (IntegrationKeyId: IntegrationKeyId, keyName: string) => Promise<void>,
|}

type ItemProps = {
    item: IntegrationKey,
    ...CommonProps,
}

const IntegrationKeyItem = ({
    item,
    hideValues,
    truncateValues,
    onDelete,
    onEdit,
}: ItemProps) => {
    const [editing, setEditing] = useState(false)
    const address = useMemo(() => (item.json || {}).address || '', [item])
    const { balance: dataBalance, fetching: fetchingDataBalance, error: dataBalanceError } = useDataBalance(address)
    const { balance: ethBalance, fetching: fetchingEthBalance, error: ethBalanceError } = useEthBalance(address)

    const onToggleEditor = useCallback((isEditing) => setEditing(isEditing), [setEditing])

    return (
        <div className={styles.keyField}>
            {!editing && (
                <div className={styles.balances}>
                    <span className={styles.balanceLabel}>DATA</span>
                    <span className={styles.balanceValue}>
                        {!fetchingDataBalance && !dataBalanceError && (dataBalance)}
                        {!fetchingDataBalance && dataBalanceError && '-'}
                    </span>
                    <span className={styles.balanceLabel}>ETH</span>
                    <span className={styles.balanceValue}>
                        {!fetchingEthBalance && !ethBalanceError && (ethBalance)}
                        {!fetchingEthBalance && ethBalanceError && '-'}
                    </span>
                </div>
            )}
            <KeyField
                className={styles.singleKey}
                keyName={item.name}
                value={(item.json || {}).address || ''}
                allowDelete
                allowEdit
                hideValue={hideValues}
                truncateValue={truncateValues}
                onDelete={() => onDelete(item.id)}
                onSave={(keyName) => onEdit(item.id, keyName || '')}
                onToggleEditor={onToggleEditor}
                valueLabel="address"
            />
        </div>
    )
}

export type ListProps = {
    integrationKeys: IntegrationKeyListType,
    className?: string,
    ...CommonProps,
}

const IntegrationKeyList = ({ integrationKeys, className, ...rest }: ListProps) => (
    <div className={cx(styles.root, 'constrainInputWidth', className)}>
        {integrationKeys.map((key: IntegrationKey) => (
            <IntegrationKeyItem {...rest} key={key.id} item={key} />
        ))}
    </div>
)

export default IntegrationKeyList
