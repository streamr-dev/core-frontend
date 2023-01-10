import React, { useCallback } from 'react'
import styled from 'styled-components'

import { Operation, setOperation, unsetOperation, checkOperation } from '$shared/components/PermissionsProvider/operations'
import { MEDIUM, TABLET } from '$shared/utils/styled'
import Checkbox from './Checkbox'

const Container = styled.div`
    display: grid;
    grid-template-rows: auto auto auto;
    gap: 21px;
    align-items: start;
    user-select: none;

    @media ${TABLET} {
        grid-template-rows: unset;
        grid-template-columns: 1fr 1fr 1fr;
    }
`

const Column = styled.div`
    display: grid;
    grid-template-rows: auto auto auto;
    gap: 12px;    

    & > span {
        color: #000000;
        font-weight: ${MEDIUM};
        font-size: 12px;
        line-height: 16px;
        justify-self: left;
    }
`

type Props = {
    address: string,
    permissionBits: number,
    disabled?: boolean,
    editor?: boolean,
    onChange: (newValue: Operation) => void,
}

const UnstyledPermissionEditor: React.FunctionComponent<Props> = ({ address, permissionBits, disabled, onChange: onChangeProp, ...props }) => {
    const onChange = useCallback((value: boolean, flag: Operation) => {
        const newPermissionBits = value ? setOperation(permissionBits, flag) : unsetOperation(permissionBits, flag)
        onChangeProp(newPermissionBits)
    }, [onChangeProp, permissionBits])

    return (
        <Container {...props}>
            <Column>
                <span>Read</span>
                <Checkbox
                    operationName="Subscribe"
                    address={address}
                    value={checkOperation(permissionBits, Operation.Subscribe)}
                    onChange={(value) => onChange(value, Operation.Subscribe)}
                    disabled={disabled}
                />
            </Column>
            <Column>
                <span>Write</span>
                <Checkbox
                    operationName="Publish"
                    address={address}
                    value={checkOperation(permissionBits, Operation.Publish)}
                    onChange={(value) => onChange(value, Operation.Publish)}
                    disabled={disabled}
                />
            </Column>
            <Column>
                <span>Manage</span>
                <Checkbox
                    operationName="Grant"
                    address={address}
                    value={checkOperation(permissionBits, Operation.Grant)}
                    onChange={(value) => onChange(value, Operation.Grant)}
                    disabled={disabled}
                />
                <Checkbox
                    operationName="Edit"
                    address={address}
                    value={checkOperation(permissionBits, Operation.Edit)}
                    onChange={(value) => onChange(value, Operation.Edit)}
                    disabled={disabled}
                />
                <Checkbox
                    operationName="Delete"
                    address={address}
                    value={checkOperation(permissionBits, Operation.Delete)}
                    onChange={(value) => onChange(value, Operation.Delete)}
                    disabled={disabled}
                />
            </Column>
        </Container>
    )
}

const PermissionEditor = styled(UnstyledPermissionEditor)``
export default PermissionEditor
