// @flow

import React, { useState, useMemo } from 'react'
import cx from 'classnames'

import type { IntegrationKeyId, IntegrationKey, IntegrationKeyList as IntegrationKeyListType } from '$shared/flowtype/integration-key-types'
import KeyField from '$userpages/components/KeyField'
import Balance from '$userpages/components/Balance'
import { useBalance, BalanceType } from '$shared/hooks/useBalance'
import styles from './integrationKeyList.pcss'
import Label from '$ui/Label'

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

    /* eslint-disable object-curly-newline */
    const {
        balance: dataBalance,
        fetching: fetchingDataBalance,
        error: dataBalanceError,
    } = useBalance(address, BalanceType.DATA)
    const {
        balance: ethBalance,
        fetching: fetchingEthBalance,
        error: ethBalanceError,
    } = useBalance(address, BalanceType.ETH)
    /* eslint-enable object-curly-newline */

    return (
        <div className={styles.keyField}>
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
                onToggleEditor={setEditing}
                valueLabel="address"
                labelComponent={!editing && (
                    <Label as="div">
                        <Balance>
                            <Balance.Account
                                name="DATA"
                                value={(!fetchingDataBalance && !dataBalanceError && dataBalance) ? dataBalance : '-'}
                            />
                            <Balance.Account
                                name="ETH"
                                value={(!fetchingEthBalance && !ethBalanceError && ethBalance) ? ethBalance : '-'}
                            />
                        </Balance>
                    </Label>
                )}
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
