import React, { useMemo, Fragment } from 'react'
import styled from 'styled-components'
import { I18n } from 'react-redux-i18n'
import SelectInput from '$ui/Select'
import Label from '$ui/Label'
import useUniqueId from '$shared/hooks/useUniqueId'

export const ALLOW_ONLY_INVITED = 'onlyInvited'

export const ALLOW_WITH_LINK = 'withLink'

const UnstyledAnonAccessSelect = ({ className, value, onChange }) => {
    // We keep this inside the component cause of i18n.
    const options = useMemo(() => (
        [ALLOW_ONLY_INVITED, ALLOW_WITH_LINK].map((o) => ({
            label: I18n.t(`modal.shareResource.${o}`),
            value: o,
        }))
    ), [])

    const id = useUniqueId('ShareSidebar') // for html labels

    return (
        <Fragment>
            <Label htmlFor={`${id}AnonAccessSelect`}>
                {I18n.t('modal.shareResource.anonymousAccess')}
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
