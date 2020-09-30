// @flow

import React, { useState, useMemo } from 'react'
import styled from 'styled-components'

import {
    BalanceType,
    type IntegrationKeyId,
    type IntegrationKey,
    type IntegrationKeyList as IntegrationKeyListType,
} from '$shared/flowtype/integration-key-types'
import KeyField from '$userpages/components/KeyField'
import Balance from '$userpages/components/Balance'
import { useAccountBalance } from '$shared/hooks/useBalances'
import Label from '$ui/Label'

import KeyList from '../../KeyList'

type CommonProps = {|
    hideValues?: boolean,
    truncateValues?: boolean,
    onDelete: (IntegrationKeyId: IntegrationKeyId) => Promise<void>,
    onEdit: (IntegrationKeyId: IntegrationKeyId, keyName: string) => Promise<void>,
    disabled?: boolean,
|}

type ItemProps = {
    item: IntegrationKey,
    ...CommonProps,
}

const KeyFieldWrapper = styled.div`
    position: relative;

    & + & {
        margin-top: 1.5rem;
    }

    label {
        line-height: 1rem;
    }
`

const StyledBalance = styled(Balance)`
    line-height: 1rem;
`

const IntegrationKeyItem = ({
    item,
    hideValues,
    truncateValues,
    onDelete,
    onEdit,
    disabled,
}: ItemProps) => {
    const [editing, setEditing] = useState(false)
    const address = useMemo(() => (item.json || {}).address || '', [item])

    const dataBalance = useAccountBalance(address, BalanceType.DATA)
    const ethBalance = useAccountBalance(address, BalanceType.ETH)

    return (
        <KeyFieldWrapper>
            <KeyField
                keyName={item.name}
                value={(item.json || {}).address || ''}
                allowDelete={!disabled}
                allowEdit={!disabled}
                hideValue={hideValues}
                truncateValue={truncateValues}
                onDelete={() => onDelete(item.id)}
                onSave={(keyName) => onEdit(item.id, keyName || '')}
                onToggleEditor={setEditing}
                labelType="address"
                labelComponent={!editing && (
                    <Label as="div">
                        <StyledBalance>
                            <Balance.Account
                                name="DATA"
                                value={dataBalance}
                            />
                            <Balance.Account
                                name="ETH"
                                value={ethBalance}
                            />
                        </StyledBalance>
                    </Label>
                )}
            />
        </KeyFieldWrapper>
    )
}

export type ListProps = {
    integrationKeys: IntegrationKeyListType,
    className?: string,
    ...CommonProps,
}

const IntegrationKeyList = ({ integrationKeys, className, ...rest }: ListProps) => (
    <KeyList className={className}>
        {integrationKeys.map((key: IntegrationKey) => (
            <IntegrationKeyItem {...rest} key={key.id} item={key} />
        ))}
    </KeyList>
)

export default IntegrationKeyList
