// @flow

import React from 'react'

import styles from './nameAndEmail.pcss'

export type NameAndEmailProps = {
    name?: string,
    email?: string,
}

const NameAndEmail = ({ name, email }: NameAndEmailProps) => (
    <div className={styles.content}>
        <div className={styles.name}>{name}</div>
        <div className={styles.email}>{email}</div>
    </div>
)

export default NameAndEmail
