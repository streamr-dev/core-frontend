// @flow

import React from 'react'
import styled from 'styled-components'

type Props = {
    children: string,
}

const Value = styled.div`
    position: absolute;
    text-align: center;
    transform: translateY(-50%);
    top: 50%;
    width: 100%;
`

const UnstyledInitials = ({ children, ...props }: Props) => (
    <div {...props}>
        <svg
            viewBox="0 0 1 1"
            xmlns="http://www.w3.org/2000/svg"
        />
        <Value>
            {children}
        </Value>
    </div>
)

const Initials = styled(UnstyledInitials)`
    background-color: #97BAC0;
    color: #FFFFFF;
    font-family: var(--mono);
    position: relative;
`

export default Initials
