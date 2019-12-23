// @flow

import { memo, useEffect, type ComponentType } from 'react'
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

export default (memo(ConfigureAnchorOffset): ComponentType<Props>)
