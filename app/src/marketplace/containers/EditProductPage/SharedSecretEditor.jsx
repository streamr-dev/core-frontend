// @flow

import React, { useEffect, useCallback, useState } from 'react'
import cx from 'classnames'
import { I18n } from 'react-redux-i18n'

import KeyField from '$userpages/components/KeyField'
import AddKeyField from '$userpages/components/KeyField/AddKeyField'
import useProduct from '../ProductController/useProduct'
import { getSecrets, postSecret, putSecret, deleteSecret } from '$mp/modules/dataUnion/services'
import type { Secret } from '$mp/modules/dataUnion/types'

import styles from './sharedSecretEditor.pcss'

type Props = {
    className?: string,
    disabled?: boolean,
}

const SharedSecretEditor = ({ className, disabled }: Props) => {
    const product = useProduct()
    const [secrets, setSecrets] = useState([])
    const dataUnionId = (product && product.beneficiaryAddress) || ''

    const fetchSecrets = useCallback(async () => {
        try {
            const result = await getSecrets({
                dataUnionId,
            })
            setSecrets(result)
        } catch (e) {
            console.error('Could not load shared secrets', e)
        }
    }, [dataUnionId])

    useEffect(() => {
        if (dataUnionId) {
            fetchSecrets()
        }
    }, [dataUnionId, fetchSecrets])

    return (
        <div className={cx(className)}>
            {secrets.map((s: Secret) => (
                <KeyField
                    key={s.id}
                    keyName={s.name}
                    value={s.secret}
                    hideValue
                    allowEdit={!disabled}
                    allowDelete={!disabled}
                    onSave={async (name) => {
                        if (name) {
                            const result = await putSecret({
                                dataUnionId,
                                secretId: s.id,
                                name,
                            })
                            setSecrets((currentSecrets) => [
                                ...currentSecrets.filter((secret) => secret.id !== s.id),
                                result,
                            ])
                        }
                    }}
                    onDelete={async () => {
                        await deleteSecret({
                            dataUnionId,
                            secretId: s.id,
                        })
                        setSecrets((currentSecrets) => currentSecrets.filter((secret) => secret.id !== s.id))
                    }}
                    labelType="sharedSecret"
                    className={styles.keyField}
                />
            ))}
            <div className={styles.addButton}>
                <AddKeyField
                    label={I18n.t('editProductPage.sharedSecrets.addSecret')}
                    addKeyFieldAllowed={!disabled}
                    labelType="sharedSecret"
                    onSave={async (name, value) => {
                        const result = await postSecret({
                            dataUnionId,
                            name,
                            secret: value,
                        })
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
