import { useCallback } from 'react'

import merge from 'lodash/merge'
import * as sharedServices from '$editor/shared/services'

import * as CanvasState from '../../state'
import usePending from './usePending'

export default function useModuleLoadCallback() {
    const { wrap } = usePending('LOAD MODULE')
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
