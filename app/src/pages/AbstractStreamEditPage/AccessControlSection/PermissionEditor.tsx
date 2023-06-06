import React from 'react'
import styled from 'styled-components'
import { StreamPermission } from 'streamr-client'
import { Bits, matchBits } from '$shared/stores/streamEditor'
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
    address: string
    permissionBits: number
    disabled?: boolean
    editor?: boolean
    onChange: (permission: StreamPermission, enabled: boolean) => void
}

function UnstyledPermissionEditor({
    address,
    permissionBits,
    disabled,
    onChange,
    ...props
}: Props) {
    return (
        <Container {...props}>
            <Column>
                <span>Read</span>
                <Checkbox
                    operationName="Subscribe"
                    address={address}
                    value={matchBits(Bits[StreamPermission.SUBSCRIBE], permissionBits)}
                    onChange={(value) => onChange(StreamPermission.SUBSCRIBE, value)}
                    disabled={disabled}
                />
            </Column>
            <Column>
                <span>Write</span>
                <Checkbox
                    operationName="Publish"
                    address={address}
                    value={matchBits(Bits[StreamPermission.PUBLISH], permissionBits)}
                    onChange={(value) => onChange(StreamPermission.PUBLISH, value)}
                    disabled={disabled}
                />
            </Column>
            <Column>
                <span>Manage</span>
                <Checkbox
                    operationName="Grant"
                    address={address}
                    value={matchBits(Bits[StreamPermission.GRANT], permissionBits)}
                    onChange={(value) => onChange(StreamPermission.GRANT, value)}
                    disabled={disabled}
                />
                <Checkbox
                    operationName="Edit"
                    address={address}
                    value={matchBits(Bits[StreamPermission.EDIT], permissionBits)}
                    onChange={(value) => onChange(StreamPermission.EDIT, value)}
                    disabled={disabled}
                />
                <Checkbox
                    operationName="Delete"
                    address={address}
                    value={matchBits(Bits[StreamPermission.DELETE], permissionBits)}
                    onChange={(value) => onChange(StreamPermission.DELETE, value)}
                    disabled={disabled}
                />
            </Column>
        </Container>
    )
}

const PermissionEditor = styled(UnstyledPermissionEditor)``

export default PermissionEditor
