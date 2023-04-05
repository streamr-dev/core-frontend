import React, { useState } from 'react'
import styled from 'styled-components'
import { truncate } from '$shared/utils/text'
import SvgIcon from '$shared/components/SvgIcon'
import { COLORS } from '$shared/utils/styled'
import useStreamId from '$app/src/shared/hooks/useStreamId'
import { Bits, matchBits, setBits, unsetBits, useStreamEditorStore } from '$app/src/shared/stores/streamEditor'
import {useAuthController} from "$auth/hooks/useAuthController"
import UnstyledPermissionEditor from './PermissionEditor'

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
    grid-template-columns: auto 1fr auto;
    gap: 8px;
    align-items: center;
    border-bottom: ${({ $isOpen }) => $isOpen ? '1px' : '0px'} solid ${COLORS.separator};
    height: 72px;
    padding: 21px;

    &:hover {
        cursor: pointer;
    }
`

const Labels = styled.div`
    display: flex;
    overflow: hidden;
`

const Label = styled.div`
    color: ${COLORS.primary};
    background-color: ${COLORS.secondary};
    border-radius: 4px;
    font-size: 12px;
    line-height: 16px;
    padding: 4px 8px;
    margin-right: 8px;
`

const YouLabel = styled(Label)`
    color: white;
    background-color: ${COLORS.primaryLight};
`

const PermissionEditor = styled(UnstyledPermissionEditor)`
    padding: 21px;
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

type Props = {
    disabled?: boolean,
    address: string,
    permissionBits: number,
}

const PermissionItem: React.FunctionComponent<Props> = ({ disabled, address, permissionBits }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const {currentAuthSession} = useAuthController()

    const operations = Object.keys(Bits).filter((permission) => matchBits(Bits[permission], permissionBits))

    const streamId = useStreamId()

    const setPermissions = useStreamEditorStore(({ setPermissions }) => setPermissions)

    return (
        <Container>
            <Title $isOpen={isOpen} onClick={() => setIsOpen((prev) => (!prev))}>
                {isOpen ? address : truncate(address)}
                {isOpen ?
                    <div /> :
                    <Labels>
                        {currentAuthSession.address != null
                        && address != null
                        && currentAuthSession.address.toLowerCase() === address.toLowerCase()
                        && (
                            <YouLabel>You</YouLabel>
                        )}
                        {operations.map((op) => (
                            <Label key={op}>{op.replace(/^\w/, (s) => s.toUpperCase())}</Label>
                        ))}
                    </Labels>
                }
                <DropdownCaret name="caretDown" $isOpen={isOpen} />
            </Title>
            {isOpen && (
                <PermissionEditor
                    address={address}
                    permissionBits={permissionBits}
                    disabled={disabled}
                    onChange={(permission, enabled) => {
                        if (!streamId) {
                            return
                        }

                        setPermissions(streamId, address, (enabled ? setBits : unsetBits)(permissionBits, Bits[permission]))
                    }}
                />
            )}
        </Container>
    )
}

export default PermissionItem
