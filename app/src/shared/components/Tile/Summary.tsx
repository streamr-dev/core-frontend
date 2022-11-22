import type { ReactNode } from 'react'
import React from 'react'
import styled, { css } from 'styled-components'
import Skeleton from '$shared/components/Skeleton'
import {MEDIUM, REGULAR, MD} from '$shared/utils/styled'
const Name = styled.div``
const Secondary = styled.div`
    font-size: 16px;
    font-weight: ${REGULAR};
`
const Description = styled(Secondary)`
    color: #323232;
    overflow-x: hidden;
    text-overflow: ellipsis;
    font-weight: ${REGULAR};
    padding-top: 8px;
`
const Label = styled(Secondary)`
    text-align: right;
`
type Root = {
    label?: ReactNode
}
const Root = styled.div<Root>`
    color: #323232;
    font-size: 18px;
    font-weight: ${MEDIUM};
    line-height: 24px;
    padding-top: 16px;

  ${({label}) => label && css`
      display: grid;
      grid-template-columns: auto auto;
      grid-gap: 0.5em;
    `};

    @media (min-width: ${MD}px) {
      padding-top: 24px;
    }
`
type Props = {
    label?: ReactNode
    name: string
    skeletonize?: boolean
    description?: string | false
}

const Summary = ({ name, description, label, skeletonize, ...props }: Props) => (
    <Root {...props} label={label}>
        <div>
            <Name>
                <Skeleton disabled={!skeletonize}>{name}</Skeleton>
            </Name>
            {!!description && (
                <Description>
                    <Skeleton disabled={!skeletonize} width="45%">
                        {description}
                    </Skeleton>
                </Description>
            )}
        </div>
        {!!label && (
            <Label>
                <Skeleton disabled={!skeletonize} width="30%">
                    {label}
                </Skeleton>
            </Label>
        )}
    </Root>
)

export default Summary
