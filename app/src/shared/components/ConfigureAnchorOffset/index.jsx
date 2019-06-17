// @flow

import { memo, useEffect } from 'react'
import { configureAnchors } from 'react-scrollable-anchor'

type Props = {
    value: number,
}

const ConfigureAnchorOffset = ({ value: offset }: Props) => {
    useEffect(() => {
        configureAnchors({
            offset,
        })
    }, [offset])

    useEffect(() => () => {
        configureAnchors({
            offset: 0,
        })
    }, [])

    return null
}

// $FlowFixMe
export default memo(ConfigureAnchorOffset)
