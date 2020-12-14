import React from 'react'
import styled from 'styled-components'
import SvgIcon from '$shared/components/SvgIcon'
import IconButton from './IconButton'
import { SM } from '$shared/utils/styled'

const UnstyledCloseButton = (props) => (
    <IconButton {...props}>
        <SvgIcon name="crossMedium" />
    </IconButton>
)

const CloseButton = styled(UnstyledCloseButton)`
    svg {
        height: 10px;
        width: 10px;
    }
`

const Wrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 16px;

    @media (min-width: ${SM}px) {
        padding: 24px;
    }
`

Object.assign(CloseButton, {
    Wrapper,
})

export default CloseButton
