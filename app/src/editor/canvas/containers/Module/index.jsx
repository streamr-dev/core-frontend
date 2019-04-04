// @flow

import React from 'react'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ModuleError from '../../components/Module/ModuleError'
import ModuleDragger from '../../components/ModuleDragger'
import Module from '../../components/Module'

export default withErrorBoundary(ModuleError)((props) => (
    <ModuleDragger module={props.module} api={props.api}>
        <Module {...props} />
    </ModuleDragger>
))
