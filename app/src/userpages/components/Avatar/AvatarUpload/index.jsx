// @flow

import React from 'react'
import { Button } from 'reactstrap'
import { Translate } from 'react-redux-i18n'

import FileUpload from '$shared/components/FileUpload'
import styles from './avatarUpload.pcss'

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

export default AvatarUpload
