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
import { MD, LG } from '$shared/utils/styled'

import Description from './Description'

const Credentials = styled.div``

const KeyList = styled.div`
    margin-top: 2.5rem;
    margin-bottom: 2rem;

    &:empty {
        display: none;
    }

    @media (min-width: ${MD}px) {
        &:empty {
            display: block;
            margin-top: 2.5rem;
            height: 1rem;
        }
    }

    @media (min-width: ${LG}px) {
        margin-top: 2.5rem;

        &:empty {
            display: block;
            margin-top: -2rem;
        }
    }
`

const StyledKeyField = styled(KeyField)`
    & + & {
        margin-top: 1.5rem;
    }
`

const AddKey = styled.div`
    margin-top: 2rem;
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
            <Credentials className="constrainInputWidth">
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
                <AddKey>
                    <Button kind="secondary" disabled>
                        {I18n.t('userpages.profilePage.apiCredentials.addAPIKey')}
                    </Button>
                </AddKey>
            </Credentials>
        </Fragment>
    )
}

export default APICredentials
