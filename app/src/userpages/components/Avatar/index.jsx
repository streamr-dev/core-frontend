// @flow

import React from 'react'
import { Button } from 'reactstrap'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import FileUpload from '$shared/components/FileUpload'
import styles from './avatar.pcss'

type NameAndEmailProps = {
    name?: string,
    email?: string,
}

type UploadProps = {
    image: string,
}

type Props = NameAndEmailProps & UploadProps & {
    editable?: boolean,
    className?: string,
}

const NameAndEmail = ({ name, email }: NameAndEmailProps) => (
    <div className={styles.content}>
        <div className={styles.name}>{name}</div>
        <div className={styles.email}>{email}</div>
    </div>
)

const UploadNormalState = () => (
    <div>
        <Button color="secondary" type="button" outline>
            <Translate value="userpages.profile.settings.upload" />
        </Button>
        <div className={styles.uploadHelpText}>
            <Translate value="userpages.profile.settings.uploadHelpText" />
        </div>
    </div>
)

const UploadDropTarget = () => (
    <span>Drop here!</span>
)

const UploadDragOver = () => (
    <span>Yay, just drop it!</span>
)

const AvatarUpload = () => (
    <FileUpload
        className={styles.upload}
        component={<UploadNormalState />}
        dropTargetComponent={<UploadDropTarget />}
        dragOverComponent={<UploadDragOver />}
        onFilesAccepted={() => {}}
        onError={() => {}}
        acceptMime={['image/jpeg', 'image/png']}
        maxFileSizeInMB={1}
        multiple={false}
        disablePreview
    />
)

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
