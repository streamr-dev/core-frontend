import React, { useMemo, Fragment, useCallback } from 'react'
import styled from 'styled-components'
import { I18n } from 'react-redux-i18n'
import SelectInput from '$ui/Select'
import Label from '$ui/Label'
import useUniqueId from '$shared/hooks/useUniqueId'
import { usePermissionsState, usePermissionsDispatch } from '$shared/components/PermissionsProvider'
import { UPDATE_PERMISSION } from '$shared/components/PermissionsProvider/utils/reducer'
import { DEFAULTS } from '$shared/components/PermissionsProvider/groups'

export const ALLOW_ONLY_INVITED = 'onlyInvited'

export const ALLOW_WITH_LINK = 'withLink'

const UnstyledAnonAccessSelect = ({ className }) => {
    // We keep this inside the component cause of i18n.
    const options = useMemo(() => (
        [ALLOW_ONLY_INVITED, ALLOW_WITH_LINK].map((o) => ({
            label: I18n.t(`modal.shareResource.${o}`),
            value: o,
        }))
    ), [])

    const dispatch = usePermissionsDispatch()

    const { changeset, combinations, resourceType } = usePermissionsState()

    const onChange = useCallback(({ value: v }) => {
        dispatch({
            type: UPDATE_PERMISSION,
            user: 'anonymous',
            value: v === ALLOW_WITH_LINK ? DEFAULTS[resourceType] : undefined,
        })
    }, [dispatch, resourceType])

    const id = useUniqueId('ShareSidebar') // for html labels

    const anonCombination = ({}).hasOwnProperty.call(changeset, 'anonymous') ? changeset.anonymous : combinations.anonymous

    const value = anonCombination ? ALLOW_WITH_LINK : ALLOW_ONLY_INVITED

    return (
        <Fragment>
            <Label htmlFor={`${id}AnonAccessSelect`}>
                Who can access this?
            </Label>
            <SelectInput
                inputId={`${id}AnonAccessSelect`}
                name="name"
                options={options}
                value={options.find(({ value: v }) => v === value)}
                onChange={onChange}
                required
                isSearchable={false}
                controlClassName={className}
            />
        </Fragment>
    )
}

const AnonAccessSelect = styled(UnstyledAnonAccessSelect)`
    && {
        background-color: #fdfdfd;
        font-size: 14px;
    }
`

export default AnonAccessSelect
