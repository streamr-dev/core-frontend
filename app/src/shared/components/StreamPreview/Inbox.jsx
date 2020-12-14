import React from 'react'
import styled from 'styled-components'

const Side = styled.div`
    height: 100%;
`

const L = styled(Side)`
    background: rgba(0, 255, 0, 0.2);
`

const R = styled(Side)`
    background: rgba(0, 0, 255, 0.2);
    position: absolute;
    right: 0;
    top: 0;
    width: 504px;
`

const UnstyledInbox = ({ className, leftComponent, rightComponent }) => (
    <div className={className}>
        <L>{leftComponent}</L>
        <R>{rightComponent}</R>
    </div>
)

const Inbox = styled(UnstyledInbox)`
    padding-right: 504px;
    position: relative;
`

Object.assign(Inbox, {
    L,
    R,
})

export default Inbox
