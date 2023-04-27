import React from 'react'
import styled from 'styled-components'
import Color from 'color'

type Props = {
    contractAddress?: string,
    symbol?: string,
}

type CircleProps = {
    tokenColor: string,
}

const Circle = styled.div<CircleProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    line-height: 16px;
    font-size: 16px;
    border-radius: 50%;
    color: ${({ tokenColor }) => Color(tokenColor).isDark() ? '#ffffff' : '#000000'};
    background-color: ${({ tokenColor }) => tokenColor};
`

const hashCode = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i += 1) {
        // eslint-disable-next-line no-bitwise
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return hash
}

const intToRGB = (i: number) => {
    // eslint-disable-next-line no-bitwise
    const c = (i & 0x00ffffff).toString(16).toUpperCase()
    return '00000'.substring(0, 6 - c.length) + c
}

const GenericTokenLogo = ({ contractAddress, symbol, ...props }: Props) => {
    const cssColor = `#${intToRGB(hashCode(contractAddress || ''))}`

    return (
        <Circle
            {...props}
            tokenColor={cssColor}
        >
            {(symbol || '?').charAt(0).toUpperCase()}
        </Circle>
    )
}

export default styled(GenericTokenLogo)``
