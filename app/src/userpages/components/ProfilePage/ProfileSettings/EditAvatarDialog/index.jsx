// @flow

import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import useModal from '$shared/hooks/useModal'
import usePending from '$shared/hooks/usePending'
import useFilePreview from '$shared/hooks/useFilePreview'
import { updateCurrentUserImage } from '$shared/modules/user/actions'

import AvatarUploadDialog from './AvatarUploadDialog'
import CropAvatarDialog from './CropAvatarDialog'

const editorPhases = {
    UPLOAD: 'upload',
    CROP: 'crop',
    PREVIEW: 'preview',
}

type Props = {
    originalImage: string,
    api: Object,
}

const EditAvatarDialog = ({ api, originalImage }: Props) => {
    const dispatch = useDispatch()
    const [phase, setPhase] = useState(editorPhases.UPLOAD)
    const { preview, createPreview } = useFilePreview()
    const { wrap, isPending } = usePending('user.UPLOAD_AVATAR')

    const onClose = useCallback(() => {
        api.close({
            uploaded: false,
            error: undefined,
        })
    }, [api])

    const onSave = useCallback(async (image: File) => (
        wrap(async () => {
            let uploaded = false
            let error

            try {
                await dispatch(updateCurrentUserImage(image))
                uploaded = true
            } catch (e) {
                console.warn(e)
                error = e
            } finally {
                api.close({
                    uploaded,
                    error,
                })
            }
        })
    ), [wrap, dispatch, api])

    const onUpload = useCallback((image: ?File) => {
        if (image) {
            createPreview(image)
            setPhase(editorPhases.CROP)
        }
    }, [createPreview])

    switch (phase) {
        case editorPhases.UPLOAD:
            return (
                <AvatarUploadDialog
                    onClose={onClose}
                    onUpload={onUpload}
                    originalImage={preview || originalImage}
                />
            )

        case editorPhases.CROP:
            return (
                <CropAvatarDialog
                    onClose={onClose}
                    onSave={onSave}
                    originalImage={preview || originalImage}
                    waiting={isPending}
                />
            )

        default:
            return null
    }
}

export default () => {
    const { api, isOpen, value } = useModal('userpages.uploadAvatar')

    if (!isOpen) {
        return null
    }

    const { originalImage } = value || {}

    return (
        <EditAvatarDialog
            api={api}
            originalImage={originalImage}
        />
    )
}
