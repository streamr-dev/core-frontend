import React from 'react'
import styled, { css } from 'styled-components'

const PendingTasksWrapper = styled.div`
    color: ${({ theme }) => (theme.isPrompted ? '#FF5C00' : '#A3A3A3')};
    font-size: 1rem;
    line-height: 1.5rem;
    width: 100%;
    min-height: 1.5rem;
    margin-bottom: 0.5rem;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    ${({ theme }) => !theme.isPrompted && css`
        &:not(:empty)::after {
            content: '...';
        }
    `}
`

const PendingTasks = ({ isPrompted, children, ...props }) => (
    <PendingTasksWrapper
        {...props}
        theme={{
            isPrompted: !!isPrompted,
        }}
    >
        {!!isPrompted && (
            <span>Please confirm transaction</span>
        )}
        {!isPrompted && children}
    </PendingTasksWrapper>
)

export default PendingTasks
