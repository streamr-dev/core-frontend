// @flow

import React from 'react'
import styled from 'styled-components'

type Props = {
    className?: ?string,
}

const UnstyledToolbarInner = ({ className, ...props }: Props) => (
    <div {...props} className={className} />
)

const ToolbarInner = styled(UnstyledToolbarInner)`
    box-sizing: content-box;
    align-items: center;
    background: #f5f5f5;
    color: #a3a3a3;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    font-size: 12px;
    height: 40px;
    justify-content: space-between;
    padding: 20px 30px;

    > * {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
    }

    .ToolbarInner-left,
    .ToolbarInner-right,
    .ToolbarInner-center {
        justify-content: space-between;
    }

    .ToolbarInner-left > * + *,
    .ToolbarInner-right > * + *,
    .ToolbarInner-center > * + * {
        margin-left: 16px;
    }
`

export default ToolbarInner
