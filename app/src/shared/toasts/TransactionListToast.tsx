import React, { FC } from 'react'
import AbstractToast from './AbstractToast'
import styled, { css } from 'styled-components'
import { COLORS, MEDIUM } from '../utils/styled'
import SvgIcon from '../components/SvgIcon'
import Spinner from '../components/Spinner'

type State = 'ongoing' | 'complete' | 'error'

export interface Operation {
    id: string
    label: string
    state?: State
    action?: FC<{ state: State | undefined }>
}

interface Props {
    operations?: Operation[]
}

export default function TransactionListToast({ operations = [] }: Props) {
    return (
        <AbstractToast>
            <Container>
                <Title>These transactions are needed to save your changes:</Title>
                <ul>
                    {operations.map(({ id, state, label, action: Action }, index) => (
                        <Item key={id} $complete={state === 'complete' || state === 'error'} $ongoing={state === 'ongoing'}>
                            <Number>{index + 1}</Number>
                            <Name>{label}</Name>
                            {Action && (
                                <ActionWrap>
                                    <Action state={state} />
                                </ActionWrap>
                            )}
                            <IconContainer>
                                {state === 'ongoing' && <Spinner size="small" color="blue" />}
                                {state === 'complete' && <Icon name="checkmark" />}
                                {state === 'error' && <Icon name="errorBadge" />}
                            </IconContainer>
                        </Item>
                    ))}
                </ul>
            </Container>
        </AbstractToast>
    )
}

const Container = styled.div`
    width: 464px;
    padding: 32px 24px;

    ul {
        list-style: none;
        margin: 24px 0 0;
        padding: 0;
    }

    li + li {
        margin-top: 8px;
    }
`

const Title = styled.div`
    font-weight: ${MEDIUM};
    font-size: 16px;
    line-height: 20px;
    width: 240px;
`

const Item = styled.li<{ $complete: boolean; $ongoing: boolean }>`
    padding: 20px 16px;
    border: 1px solid ${COLORS.inputBackground};
    border-radius: 4px;
    align-items: center;
    font-size: 16px;
    line-height: 20px;
    display: flex;

    > * + * {
        margin-left: 16px;
    }

    ${({ $complete = false }) =>
        $complete &&
        css`
            background-color: ${COLORS.secondary};
        `}

    ${({ $ongoing = false }) =>
        $ongoing &&
        css`
            border-color: #b3d4ff;
        `}
`

const Number = styled.div`
    font-size: 12px;
    line-height: normal;
    border-radius: 50%;
    background-color: #000000;
    color: #ffffff;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`

const Name = styled.div`
    font-size: 16px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-grow: 1;
`

const IconContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
    height: 18px;
    width: 18px;
    flex-shrink: 0;
`

const Icon = styled(SvgIcon)`
    display: flex;
    width: 100%;
    height: 100%;
`

const ActionWrap = styled.div``
