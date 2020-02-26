// @flow

import React, { type Node } from 'react'
import styled from 'styled-components'
import Skeleton from '$shared/components/Skeleton'
import { MEDIUM } from '$shared/utils/styled'

const Name = styled.div`
    margin-bottom: 2px;
`

const Secondary = styled.div`
    font-size: 12px;
`

const UpdatedAt = styled(Secondary)`
    color: #a3a3a3;
`

const Label = styled(Secondary)`
`

const Root = styled.div`
    color: #323232;
    font-size: 16px;
    font-weight: ${MEDIUM};
    line-height: 20px;
    padding-top: 8px;
`

type Props = {
    label?: Node,
    name: string,
    skeletonize?: boolean,
    updatedAt?: string | false,
}

const Summary = ({
    name,
    updatedAt,
    label,
    skeletonize,
    ...props
}: Props) => (
    <Root {...props}>
        <Name>
            <Skeleton disabled={!skeletonize}>
                {name}
            </Skeleton>
        </Name>
        {!!updatedAt && (
            <UpdatedAt>
                <Skeleton disabled={!skeletonize} width="45%">
                    {updatedAt}
                </Skeleton>
            </UpdatedAt>
        )}
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
