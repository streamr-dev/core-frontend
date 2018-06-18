// @flow

import type { Canvas } from '../canvas-types'
import type { ErrorInUi } from '../common-types'

export type CanvasState = {
    list: Array<Canvas>,
    error: ?ErrorInUi,
    fetching?: boolean
}
