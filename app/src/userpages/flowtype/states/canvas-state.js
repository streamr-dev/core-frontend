// @flow

import type { Canvas } from '../canvas-types'
import type { ErrorInUi } from '../common-types'

export type CanvasState = {
    byId: {
        [$ElementType<Canvas, 'id'>]: Canvas
    },
    list: Array<Canvas>,
    error: ?ErrorInUi,
    fetching?: boolean
}
