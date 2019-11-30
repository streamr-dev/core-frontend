// @flow

import type { CanvasId } from '../canvas-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

export type CanvasState = {
    ids: Array<CanvasId>,
    openCanvasId: ?CanvasId,
    error: ?ErrorInUi,
    fetching: boolean,
}
