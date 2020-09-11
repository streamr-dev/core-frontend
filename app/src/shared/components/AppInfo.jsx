import React from 'react'
import styled from 'styled-components'
import { MEDIUM, MONO } from '$shared/utils/styled'

const UnstyledAppInfo = (props) => {
    const { version, branch, hash } = global.streamr.info()

    return (
        <div {...props}>
            Core {[version, branch, hash].filter(Boolean).join(' ')}
        </div>
    )
}

const AppInfo = styled(UnstyledAppInfo)`
    font-family: ${MONO};
    font-size: 10px;
    font-weight: ${MEDIUM};
    letter-spacing: 1px;
    text-transform: uppercase;
`

export default AppInfo
