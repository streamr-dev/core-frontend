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
import { usePending } from '$shared/hooks/usePending'

import styles from '../profilePage.pcss'

import CredentialsControl from './CredentialsControl'

const APICredentials = () => {
    const keys = useSelector(selectMyResourceKeys)
    const sortedKeys = useMemo(() => keys.sort((a, b) => a.name.localeCompare(b.name)), [keys])
    const dispatch = useDispatch()
    const { isPending } = usePending('user.SAVE')
    const { wrap: wrapApiCredentials } = usePending('user.API_CREDENTIALS')

    const addKey = useCallback(async (keyName: string) => (
        wrapApiCredentials(async () => {
            await dispatch(addMyResourceKey(keyName))
        })
    ), [wrapApiCredentials, dispatch])
    const editKey = useCallback(async (keyName: ?string, keyId: ?ResourceKeyId) => (
        wrapApiCredentials(async () => {
            await dispatch(editMyResourceKey(keyId || '', keyName || ''))
        })
    ), [wrapApiCredentials, dispatch])
    const removeKey = useCallback(async (keyId: ResourceKeyId) => (
        wrapApiCredentials(async () => {
            await dispatch(removeMyResourceKey(keyId))
        })
    ), [wrapApiCredentials, dispatch])

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
                disabled={isPending}
            />
        </Fragment>
    )
}

export default APICredentials
