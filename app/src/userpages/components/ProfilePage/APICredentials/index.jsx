// @flow

import React, { Fragment, useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Translate } from 'react-redux-i18n'

import {
    getMyResourceKeys,
    addMyResourceKey,
    editMyResourceKey,
    removeMyResourceKey,
} from '$shared/modules/resourceKey/actions'
import { selectMyResourceKeys } from '$shared/modules/resourceKey/selectors'
import type { ResourceKeyId } from '$shared/flowtype/resource-key-types'

import styles from '../profilePage.pcss'

import CredentialsControl from './CredentialsControl'

const APICredentials = () => {
    const keys = useSelector(selectMyResourceKeys)
    const sortedKeys = useMemo(() => keys.sort((a, b) => a.name.localeCompare(b.name)), [keys])
    const dispatch = useDispatch()

    const addKey = useCallback((keyName: string) => dispatch(addMyResourceKey(keyName)), [dispatch])
    const editKey = useCallback((keyName: ?string, keyId: ?ResourceKeyId) => (
        dispatch(editMyResourceKey(keyId || '', keyName || ''))
    ), [dispatch])
    const removeKey = useCallback((keyId: ResourceKeyId) => dispatch(removeMyResourceKey(keyId)), [dispatch])

    useEffect(() => {
        dispatch(getMyResourceKeys())
    }, [dispatch])

    return (
        <Fragment>
            <Translate
                value="userpages.profilePage.apiCredentials.description"
                tag="p"
                className={styles.longText}
            />
            <CredentialsControl
                keys={sortedKeys}
                addKey={addKey}
                onSave={editKey}
                removeKey={removeKey}
                disableDelete={keys.length <= 1}
                className={styles.keyList}
            />
        </Fragment>
    )
}

export default APICredentials
