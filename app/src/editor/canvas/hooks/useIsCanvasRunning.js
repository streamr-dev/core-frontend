// @flow

import { useMemo } from 'react'
import { RunStates } from '../state'
import useCanvas from '../components/CanvasController/useCanvas'

export default () => {
    const canvas = useCanvas()

    return useMemo(() => (
        !!canvas && canvas.state === RunStates.Running
    ), [canvas])
}
