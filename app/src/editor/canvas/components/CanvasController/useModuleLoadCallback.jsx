import { useCallback } from 'react'
import merge from 'lodash/merge'

import * as sharedServices from '$editor/shared/services'
import usePending from '$shared/hooks/usePending'

import * as CanvasState from '../../state'

export default function useModuleLoadCallback() {
    const { wrap } = usePending('canvas.LOAD MODULE')
    return useCallback(async (canvas, module = {}) => (
        wrap(async () => {
            if (module.hash) {
                module = merge({}, CanvasState.getModule(canvas, module.hash), module)
            }
            return sharedServices.getModule({
                id: module.id,
                configuration: module,
            })
        })
    ), [wrap])
}
