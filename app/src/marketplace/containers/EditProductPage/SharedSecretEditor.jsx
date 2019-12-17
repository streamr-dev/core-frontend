// @flow

import React, { useEffect, useCallback, useState } from 'react'
import cx from 'classnames'
import { I18n } from 'react-redux-i18n'

import KeyField from '$userpages/components/KeyField'
import AddKeyField from '$userpages/components/KeyField/AddKeyField'
import useProduct from '../ProductController/useProduct'
import { getSecrets, postSecret, putSecret, deleteSecret } from '$mp/modules/communityProduct/services'
import type { Secret } from '$mp/modules/communityProduct/types'

import styles from './sharedSecretEditor.pcss'

type Props = {
    className?: string
}

const SharedSecretEditor = ({ className }: Props) => {
    const product = useProduct()
    const [secrets, setSecrets] = useState([])
    const communityId = (product && product.beneficiaryAddress) || ''

    const fetchSecrets = useCallback(async () => {
        try {
            const result = await getSecrets(communityId)
            setSecrets(result)
        } catch (e) {
            console.error('Could not load shared secrets', e)
        }
    }, [communityId])

    useEffect(() => {
        if (communityId) {
            fetchSecrets()
        }
    }, [communityId, fetchSecrets])

    return (
        <div className={cx(className)}>
            {secrets.map((s: Secret) => (
                <KeyField
                    key={s.id}
                    keyName={s.name}
                    value={s.secret}
                    hideValue
                    allowEdit
                    allowEditValue={false}
                    allowDelete
                    onSave={async (name) => {
                        if (name) {
                            const result = await putSecret(communityId, s.id, name)
                            setSecrets((currentSecrets) => [
                                ...currentSecrets.filter((secret) => secret.id !== s.id),
                                result,
                            ])
                        }
                    }}
                    onDelete={async () => {
                        await deleteSecret(communityId, s.id)
                        setSecrets((currentSecrets) => currentSecrets.filter((secret) => secret.id !== s.id))
                    }}
                    className={styles.keyField}
                />
            ))}
            <div className={styles.addButton}>
                <AddKeyField
                    label={I18n.t('editProductPage.sharedSecrets.addSecret')}
                    addKeyFieldAllowed
                    onSave={async (name, value) => {
                        const result = await postSecret(communityId, name, value)
                        setSecrets((currentSecrets) => [
                            ...currentSecrets,
                            result,
                        ])
                    }}
                />
            </div>
        </div>
    )
}

export default SharedSecretEditor
