// @flow

import { useContext, useEffect, useCallback } from 'react'
import debounce from 'lodash/debounce'
import { Context as ResizableContext } from '$editor/canvas/components/Resizable'

type Props = {
    onResize: () => void,
}

const ResizeWatcher = ({ onResize: onResizeProp }: Props) => {
    const { width, height } = useContext(ResizableContext)

    const onResize = useCallback(debounce(() => {
        onResizeProp()
    }, 50), [onResizeProp])

    useEffect(() => {
        onResize()
    }, [width, height, onResize])

    return null
}

export default ResizeWatcher
