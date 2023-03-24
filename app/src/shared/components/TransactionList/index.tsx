import React from 'react'
import styled, { css } from 'styled-components'
import { COLORS, MEDIUM } from '$shared/utils/styled'
import SvgIcon from '$shared/components/SvgIcon'
import Spinner from '$shared/components/Spinner'
import { useStreamEditorStore } from '$app/src/pages/AbstractStreamEditPage/state'

const Container = styled.div`
    width: 469px;
    padding: 18px 8px;
`

const List = styled.div`
    display: grid;
    grid-auto-flow: row;
    gap: 8px;
`

const Title = styled.div`
    font-weight: ${MEDIUM};
    font-size: 16px;
    line-height: 20px;
    margin-bottom: 18px;
`

type ItemProps = {
    completed?: boolean,
    inProgress?: boolean,
}

const Item = styled.div<ItemProps>`
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 8px;
    padding: 20px 16px;
    border: 1px solid ${COLORS.inputBackground};
    border-radius: 4px;
    align-items: center;
    font-size: 16px;
    line-height: 20px;

    ${({ completed }) => completed && css`
        background-color: ${COLORS.secondary};
    `}

    ${({ inProgress }) => inProgress && css`
        border: 1px solid #B3D4FF;
    `}
`

const Number = styled.div`
    font-size: 12px;
    line-height: 12px;
    border-radius: 50%;
    background-color: #000000;
    color: #ffffff;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Name = styled.div`
    font-size: 16px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const IconContainer = styled.div`
    width: 18px;
    height: 18px;
`

const Icon = styled(SvgIcon)`
    display: flex;
    width: 100%;
    height: 100%;
`

export const TransactionList: React.FunctionComponent = () => {
    const persistOperations = useStreamEditorStore((state) => state.persistOperations)

    return (
        <Container>
            <Title>These transactions are needed<br/>to save your changes:</Title>
            <List>
                {persistOperations.map((op, index) => (
                    <Item
                        key={index}
                        completed={op.state === 'complete' || op.state === 'error'}
                        inProgress={op.state === 'inprogress'}
                    >
                        <Number>{index + 1}</Number>
                        <Name>{op.name}</Name>
                        <IconContainer>
                            {op.state === 'inprogress' && (
                                <Spinner size='small' color='blue' />
                            )}
                            {op.state === 'complete' && (
                                <Icon name="checkmark" />
                            )}
                            {op.state === 'error' && (
                                <Icon name="errorBadge" />
                            )}
                        </IconContainer>
                    </Item>
                ))}
            </List>
        </Container>
    )
}
