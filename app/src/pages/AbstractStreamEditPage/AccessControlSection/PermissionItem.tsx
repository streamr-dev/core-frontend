import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { truncate } from '$shared/utils/text'
import SvgIcon from '$shared/components/SvgIcon'
import { COLORS, MEDIUM } from '$shared/utils/styled'
import { Operation, checkOperation, setOperation, unsetOperation } from '$shared/components/PermissionsProvider/operations'
import { usePermissionsDispatch } from '$shared/components/PermissionsProvider'
import { UPDATE_PERMISSION } from '$shared/components/PermissionsProvider/utils/reducer'
import Checkbox from './Checkbox'

const Container = styled.div`
    background: #ffffff;
    border-radius: 4px;    
    display: grid;
    grid-template-rows: 1fr auto auto;
    align-items: center;

    transition: all 180ms ease-in-out;
`

type TitleProps = {
    $isOpen: boolean,
}

const Title = styled.div<TitleProps>`
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    border-bottom: ${({ $isOpen }) => $isOpen ? '1px' : '0px'} solid ${COLORS.separator};
    height: 72px;
    padding: 21px;

    &:hover {
        cursor: pointer;
    }
`

type DropdownCaretProps = {
    $isOpen: boolean,
}

const DropdownCaret = styled(SvgIcon)<DropdownCaretProps>`
    display: block;
    color: ${COLORS.primaryLight};
    width: 12px;
    height: 12px;
    transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0deg)' };
    transition: transform 180ms ease-in-out;
`

const PermissionEditor = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 21px;
    padding: 21px;
    align-items: start;
    user-select: none;
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
    }
`

type Props = {
    disabled?: boolean,
    address: string,
    permissionBits: any,
}

const PermissionItem: React.FunctionComponent<Props> = ({ disabled, address, permissionBits }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const dispatch = usePermissionsDispatch()

    console.log(permissionBits)

    const onChange = useCallback((value: boolean, flag: Operation) => {
        // console.log(value, flag)
        const newPermissionBits = value ? setOperation(permissionBits, flag) : unsetOperation(permissionBits, flag)
        // console.log(newPermissionBits)
        dispatch({
            type: UPDATE_PERMISSION,
            user: address,
            // eslint-disable-next-line no-bitwise
            value: newPermissionBits,
        })
    }, [dispatch, address, permissionBits])

    return (
        <Container>
            <Title $isOpen={isOpen} onClick={() => setIsOpen((prev) => (!prev))}>
                {isOpen ? address : truncate(address)}
                <DropdownCaret name="caretDown" $isOpen={isOpen} />
            </Title>
            {isOpen && (
                <PermissionEditor>
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
                </PermissionEditor>
            )}
        </Container>
    )
}

export default PermissionItem
