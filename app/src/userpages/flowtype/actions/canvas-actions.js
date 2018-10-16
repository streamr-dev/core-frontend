// @flow

import type { Canvas } from '../canvas-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import * as actions from '../../modules/canvas/actions'

export type CanvasAction = {
    type: typeof actions.GET_CANVASES_REQUEST
} | {
    type: typeof actions.GET_CANVASES_SUCCESS,
    canvases: Array<Canvas>
} | {
    type: typeof actions.GET_CANVASES_FAILURE,
    error: ErrorInUi
}
