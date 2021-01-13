import React from 'react'
import styled from 'styled-components'
import { Translate } from 'react-redux-i18n'
import CopyLink from './CopyLink'
import SharedButton from '$shared/components/Button'

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
                <Translate value="modal.common.cancel" />
            </CancelButton>
            <SaveButton onClick={onSave} disabled={disabled} waiting={waiting}>
                <Translate value="modal.shareResource.save" />
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
