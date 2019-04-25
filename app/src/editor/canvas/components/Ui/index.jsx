// @flow

import React, { useContext } from 'react'
import ModuleUI from '$editor/shared/components/ModuleUI'
import { Context as ResizableContext } from '../Resizable'
import { Context as SizeConstraintContext } from '../Resizable/SizeConstraintProvider'

const Ui = (props: {}) => {
    const { width, height } = useContext(ResizableContext)
    const { minHeight } = useContext(SizeConstraintContext)

    return (
        <div
            style={{
                height: height - minHeight,
                overflow: 'hidden',
                position: 'relative',
                width,
            }}
        >
            <ModuleUI {...props} />
        </div>
    )
}

export default Ui
