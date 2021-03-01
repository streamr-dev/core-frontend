import React from 'react'
import styled from 'styled-components'
import SharedButton from '$shared/components/Button'
import CopyLink from './CopyLink'

const Button = styled(SharedButton)``

const CancelButton = styled(Button)`
    background: transparent;
    border: transparent;
    color: #525252 !important;
    outline: transparent;
`

const SaveButton = styled(Button)`
    overflow: hidden;
`

const UnstyledFooter = ({
    disabled,
    onCancel,
    onSave,
    waiting,
    ...props
}) => (
    <div {...props}>
        <div>
            <CopyLink />
        </div>
        <div>
            <CancelButton onClick={onCancel} kind="link">
                Cancel
            </CancelButton>
            <SaveButton onClick={onSave} disabled={disabled} waiting={waiting}>
                Save
            </SaveButton>
        </div>
    </div>
)

const Footer = styled(UnstyledFooter)`
    border-top: 1px solid #efefef;
    display: flex;

    ${Button} {
        min-width: 96px;
    }

    > div:first-child {
        flex-grow: 1;
    }
`

export default Footer
