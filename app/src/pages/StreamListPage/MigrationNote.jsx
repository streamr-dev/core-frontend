import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    display: grid;
    grid-template-columns: 80px 1fr;
    align-items: center;
    margin: 5em 0;
    background: #FFFFFF;
    border-radius: 4px;
    padding: 1.5em 2em 1.5em 0;
`

const Message = styled.span`
    font-size: 16px;
    line-height: 21px;
`

const IconContainer = styled.div`
    justify-self: center;
    width: 32px;
    height: 32px;
`

const InfoIcon = () => (
    <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path d="M16 6C10.477 6 6 10.477 6 16s4.477 10 10 10 10-4.477 10-10S21.523 6 16 6Z" fill="#0324FF" />
        <path d="M16 14.438V21" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 11.438v.052" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const MigrationNote = () => (
    <Container>
        <IconContainer>
            <InfoIcon />
        </IconContainer>
        <Message>
            Not what you expected? Your streams might be in the
            {' '}
            <a target="_blank" rel="nofollow noopener noreferrer" href="https://corea.streamr.network/">previous network</a>
            {' '}
            and can be migrated.
        </Message>
    </Container>
)

export default MigrationNote
