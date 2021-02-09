// @flow

import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { CanvasId } from '../canvas-types'

export type CanvasState = {
    ids: Array<CanvasId>,
    error: ?ErrorInUi,
    fetching: boolean,
}
