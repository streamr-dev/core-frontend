import React, { Fragment, useCallback } from 'react'
import styled from 'styled-components'
import SelectInput from '$ui/Select'
import Label from '$ui/Label'
import useUniqueId from '$shared/hooks/useUniqueId'
import { usePermissionsState, usePermissionsDispatch } from '$shared/components/PermissionsProvider'
import { UPDATE_PERMISSION } from '$shared/components/PermissionsProvider/utils/reducer'
import { DEFAULTS } from '$shared/components/PermissionsProvider/groups'
import address0 from '$utils/address0'

export const ALLOW_ONLY_INVITED = {
    id: 'onlyInvited',
    title: 'Private — only people you’ve invited',
}

export const ALLOW_WITH_LINK = {
    id: 'withLink',
    title: 'Public — anyone with link or via API',
}

const options = [ALLOW_ONLY_INVITED, ALLOW_WITH_LINK].map(({ id, title }) => ({
    label: title,
    value: id,
}))

const UnstyledAnonAccessSelect = ({ className }) => {
    const dispatch = usePermissionsDispatch()

    const { changeset, combinations, resourceType } = usePermissionsState()

    const onChange = useCallback(({ value: v }) => {
        dispatch({
            type: UPDATE_PERMISSION,
            user: address0,
            value: v === ALLOW_WITH_LINK.id ? DEFAULTS[resourceType] : undefined,
        })
    }, [dispatch, resourceType])

    const id = useUniqueId('ShareSidebar') // for html labels

    const anonCombination = (({}).hasOwnProperty.call(changeset, address0) ? changeset : combinations)[address0]

    const value = anonCombination ? ALLOW_WITH_LINK.id : ALLOW_ONLY_INVITED.id

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
