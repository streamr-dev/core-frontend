import React from 'react'

import { StreamPermission } from 'streamr-client'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import TOCSection from '$shared/components/TOCPage/TOCSection'

export type Props = {
    disabled: boolean,
}

const AccessControlSection: React.FunctionComponent<Props> = ({ disabled: disabledProp, ...props }) => {
    const { [StreamPermission.EDIT]: canEdit = false } = useStreamPermissions()
    const disabled = disabledProp || !canEdit

    return (
        <TOCSection id="accessControl" title="Access control">
            <div disabled={disabled} {...props}>TODO</div>
        </TOCSection>
    )
}

export default AccessControlSection
