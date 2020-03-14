// @flow

import React, { useEffect, useCallback, useRef } from 'react'

import useModal from '$shared/hooks/useModal'
import useFilePreview from '$shared/hooks/useFilePreview'
import CropImageModal from '$mp/components/Modal/CropImageModal'

type Props = {
    image: File,
    api: Object,
}

const PreviewAndCropModal = ({ image, api }: Props) => {
    const resultRef = useRef(undefined)
    const { preview, createPreview } = useFilePreview()

    useEffect(() => {
        createPreview(image)
    }, [image, createPreview])

    const onClose = useCallback(() => {
        api.close(resultRef.current)
    }, [api])

    const onSave = useCallback((file: File) => {
        resultRef.current = file
        onClose()
    }, [onClose])

    return (
        <CropImageModal
            imageUrl={preview || ''}
            onSave={onSave}
            onClose={onClose}
        />
    )
}

export default () => {
    const { isOpen, api, value } = useModal('cropImage')

    if (!isOpen) {
        return null
    }

    const { image } = value || {}

    return (
        <PreviewAndCropModal
            image={image}
            api={api}
        />
    )
}
