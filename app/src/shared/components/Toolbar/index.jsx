// @flow

import React from 'react'
import styled, { css } from 'styled-components'
import Buttons, { type ButtonActions } from '$shared/components/Buttons'
import { MD } from '$shared/utils/styled'
import ElevatedContainer from '$shared/components/ElevatedContainer'

const Cell = styled.div`
    align-items: center;
    display: flex;
`

const Left = styled(Cell)``

const Middle = styled(Cell)``

const Right = styled.div`
    text-align: right;
`

type Props = {
    actions?: ButtonActions,
    altMobileLayout?: boolean,
    left?: Node,
    middle?: Node,
}

const UnstyledToolbar = ({
    actions,
    altMobileLayout,
    left,
    middle,
    ...props
}: Props) => (
    <ElevatedContainer {...props} data-test-hook="Toolbar">
        {!!(left || middle) && (
            <Left>
                {left}
            </Left>
        )}
        {!!middle && (
            <Middle>
                {middle}
            </Middle>
        )}
        {!!actions && (
            <Right>
                <Buttons actions={actions} />
            </Right>
        )}
    </ElevatedContainer>
)

const Toolbar = styled(UnstyledToolbar)`
    background-color: white;
    display: flex;
    min-height: 4rem;
    padding: 1.25rem 2rem;
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 5;
    min-height: 80px;
    align-items: center;

    ${({ altMobileLayout }) => !!altMobileLayout && css`
        @media (max-width: ${MD - 1}px) {
            bottom: 0;
            padding: 15px;
            position: fixed;
            top: auto;
        }
    `}

    ${Left},
    ${Right} {
        flex: 1;
    }
`

export default Toolbar
