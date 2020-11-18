import React from 'react'
import { I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import Tooltip from '$shared/components/Tooltip'

const OkTheme = {
    id: 'ok',
    background: '#2AC437',
}

const ErrorTheme = {
    id: 'error',
    background: '#FF0F2D',
}

const InactiveTheme = {
    id: 'inactive',
    background: '#CDCDCD',
}

const RemovedTheme = {
    id: 'removed',
    background: '#ADADAD',
}

const PendingTheme = {
    id: 'pending',
    background: '#FFBC00',
}

const Icon = styled.div.attrs(({ theme }) => ({
    'data-test-hook': `Status ${theme.id}`,
}))`
    position: relative;
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.background || '#CDCDCD'};
`

const StatusIcon = ({ status = StatusIcon.INACTIVE, className, tooltip = false }) => {
    let statusText

    if (tooltip) {
        statusText = (typeof tooltip === 'string') ? tooltip : I18n.t(`shared.status.${status.id || 'inactive'}`)

        return (
            <Tooltip value={statusText} placement={Tooltip.BOTTOM}>
                <Icon theme={status} className={className} />
            </Tooltip>
        )
    }

    return (
        <Icon theme={status} className={className} />
    )
}

StatusIcon.OK = OkTheme
StatusIcon.ERROR = ErrorTheme
StatusIcon.INACTIVE = InactiveTheme
StatusIcon.PENDING = PendingTheme
StatusIcon.REMOVED = RemovedTheme

export default StatusIcon
