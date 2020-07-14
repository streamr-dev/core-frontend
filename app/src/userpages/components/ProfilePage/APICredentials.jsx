// @flow

import React, { Fragment, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import KeyField from '$userpages/components/KeyField'
import Button from '$shared/components/Button'
import type { ResourceKey } from '$shared/flowtype/resource-key-types'
import { getMyResourceKeys } from '$shared/modules/resourceKey/actions'
import { selectMyResourceKeys } from '$shared/modules/resourceKey/selectors'

import Description from './Description'
import KeyList from './KeyList'

const StyledKeyField = styled(KeyField)`
    & + & {
        margin-top: 1.5rem;
    }
`

const APICredentials = () => {
    const keys = useSelector(selectMyResourceKeys)
    const sortedKeys = useMemo(() => keys.sort((a, b) => a.name.localeCompare(b.name)), [keys])
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getMyResourceKeys())
    }, [dispatch])

    return (
        <Fragment>
            <Description
                value="userpages.profilePage.apiCredentials.description"
                tag="p"
                dangerousHTML
            />
            <KeyList>
                {sortedKeys.map((key: ResourceKey) => (
                    <StyledKeyField
                        key={key.id}
                        keyName={key.name}
                        value={key.id}
                        hideValue
                        allowEdit={false}
                        allowDelete={false}
                        disableDelete
                    />
                ))}
            </KeyList>
            <Button kind="secondary" disabled>
                {I18n.t('userpages.profilePage.apiCredentials.addAPIKey')}
            </Button>
        </Fragment>
    )
}

export default APICredentials
