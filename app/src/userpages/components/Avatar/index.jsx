// @flow

import React from 'react'
import cx from 'classnames'

import AvatarUpload from './AvatarUpload'
import NameAndEmail, { type NameAndEmailProps } from './NameAndEmail'
import styles from './avatar.pcss'

type UploadProps = {
    image: string,
}

type Props = NameAndEmailProps & UploadProps & {
    editable?: boolean,
    className?: string,
}

const Avatar = ({
    image,
    name,
    email,
    editable,
    className,
}: Props) => (
    <div className={cx(className, styles.container)}>
        <img className={styles.avatar} src={image} alt={name} />
        {!editable && (
            <NameAndEmail name={name} email={email} />
        )}
        {editable && (
            <AvatarUpload image={image} />
        )}
    </div>
)

export default Avatar
