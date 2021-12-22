// @flow

import React from 'react'
import styled, { css } from 'styled-components'
import Buttons, { type ButtonActions } from '$shared/components/Buttons'
import { MD } from '$shared/utils/styled'
import ElevatedContainer from '$shared/components/ElevatedContainer'
import UnstyledLoadingIndicator from '$shared/components/LoadingIndicator'

const Cell = styled.div`
    align-items: center;
    display: flex;
`

const Left = styled(Cell)``

const Middle = styled(Cell)``

const Right = styled.div`
    text-align: right;
`

const Items = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 80px;
    padding: 1.25rem 2rem;

    ${Left},
    ${Right} {
        flex: 1;
    }
`

const LoadingIndicator = styled(UnstyledLoadingIndicator)``

type Props = {
    actions?: ButtonActions,
    altMobileLayout?: boolean,
    left?: Node,
    middle?: Node,
    loading?: boolean,
}

const UnstyledToolbar = ({
    actions,
    altMobileLayout,
    left,
    middle,
    loading,
    ...props
}: Props) => (
    <ElevatedContainer {...props} data-test-hook="Toolbar">
        <Items>
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
        </Items>
        <LoadingIndicator loading={!!loading} />
    </ElevatedContainer>
)

const Toolbar = styled(UnstyledToolbar)`
    background-color: white;
    position: sticky;
    top: 0;
    z-index: 5;
    width: 100%;

    ${LoadingIndicator} {
        position: absolute;
        bottom: 0;
    }

    ${({ altMobileLayout }) => !!altMobileLayout && css`
        @media (max-width: ${MD - 1}px) {
            bottom: 0;
            position: fixed;
            top: auto;

            ${LoadingIndicator} {
                top: 0;
                bottom: auto;
            }

            ${Items} {
                padding: 15px;
            }
        }
    `}
`

export default Toolbar
