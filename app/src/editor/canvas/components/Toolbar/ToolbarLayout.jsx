// @flow

import React from 'react'
import styled from 'styled-components'

type Props = {
    className?: ?string,
}

const classNames = {
    CENTER: 'ToolbarLayout-center',
    LEFT: 'ToolbarLayout-left',
    RIGHT: 'ToolbarLayout-right',
}

const UnstyledToolbarLayout = ({ className, ...props }: Props) => (
    <div {...props} className={className} />
)

const ToolbarLayout = styled(UnstyledToolbarLayout)`
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

    .${classNames.LEFT},
    .${classNames.RIGHT},
    .${classNames.CENTER} {
        justify-content: space-between;
    }

    .${classNames.LEFT} > * + *,
    .${classNames.RIGHT} > * + *,
    .${classNames.CENTER} > * + * {
        margin-left: 16px;
    }
`

ToolbarLayout.classNames = classNames

export default ToolbarLayout
