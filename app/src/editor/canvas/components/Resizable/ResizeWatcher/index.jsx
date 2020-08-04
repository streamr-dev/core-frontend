// @flow

import { useContext, useEffect, useCallback } from 'react'
import debounce from 'lodash/debounce'
import { Context as ResizableContext } from '$editor/canvas/components/Resizable'

type Props = {
    onResize: () => void,
}

export const useResizeWatcher = (onResizeProp: () => void) => {
    const { width, height } = useContext(ResizableContext)

    const onResize = useCallback(debounce(() => {
        onResizeProp()
    }, 50), [onResizeProp])

    useEffect(() => {
        onResize()
    }, [width, height, onResize])
}

const ResizeWatcher = ({ onResize }: Props) => {
    useResizeWatcher(onResize)

    return null
}

export default ResizeWatcher
