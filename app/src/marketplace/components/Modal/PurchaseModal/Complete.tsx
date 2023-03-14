import React from 'react'
import styled from 'styled-components'
import SvgIcon from '$shared/components/SvgIcon'
import Button from '$shared/components/Button'

import { DialogContainer } from './styles'

const Box = styled.div`
    display: grid;
    grid-template-rows: 32px 28px auto 40px;
    gap: 12px;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 32px 24px;
    width: 408px;
    height: 396px;
    justify-self: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const Title = styled.div`
    font-size: 24px;
    line-height: 24px;
    text-align: center;
`

const Description = styled.div`
    font-size: 14px;
    line-height: 24px;
    text-align: center;
`

const Icon = styled(SvgIcon)`
    width: 112px;
    height: 112px;
    justify-self: center;
    align-self: center;
`

type Props = {
    visible: boolean,
    onConfirm: () => void,
}

const Complete = ({ visible, onConfirm }: Props) => {
    if (!visible) {
        return null
    }

    return (
        <DialogContainer>
            <Box>
                <Title>Success!</Title>
                <Description>Access to the project was granted.</Description>
                <Icon name='checkmarkOutline' />
                <Button
                    onClick={() => onConfirm()}
                >
                    Done
                </Button>
            </Box>
        </DialogContainer>
    )
}

export default Complete
