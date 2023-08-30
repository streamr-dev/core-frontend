import React, { useContext, useCallback, useEffect, FunctionComponent } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import ImageUpload from '~/shared/components/ImageUpload'
import Errors from '~/shared/components/Ui/Errors'
import useFilePreview from '~/shared/hooks/useFilePreview'
import { COLORS } from '~/shared/utils/styled'
import { ProjectHeroImageStyles } from '~/marketplace/containers/ProjectPage/Hero/ProjectHero2.styles'
import { useEditableProjectActions } from '~/marketplace/containers/ProductController/useEditableProjectActions'
import { ProjectStateContext } from '~/marketplace/contexts/ProjectStateContext'
import { Layer } from '~/utils/Layer'
import CropImageModal from '~/components/CropImageModal/CropImageModal'
import useValidation from '../ProductController/useValidation'

type Props = {
    disabled?: boolean
}

const cropModal = toaster(CropImageModal, Layer.Modal)

const Container = styled.div`
    ${ProjectHeroImageStyles};

    .coverImageUpload {
        background-color: ${COLORS.primaryLight};
        border-radius: 16px;
        min-height: unset;
        aspect-ratio: 1/1;
    }

    .imageUploadDropZone {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        transition: opacity 150ms ease-in;

        img {
            width: 40%;
        }
    }

    .shared_imageUpload_imageUploaded {
        .imageUploadDropZone {
            opacity: 0;
        }
        &:hover {
            .imageUploadDropZone {
                opacity: 1;
            }
        }
    }

    .shared_imageUpload_previewImage {
        transition: opacity 150ms ease-in;
    }
`

export const CoverImage: FunctionComponent<Props> = ({ disabled }) => {
    const { state: product } = useContext(ProjectStateContext)
    const { updateImageFile } = useEditableProjectActions()
    const { isValid, message } = useValidation('imageUrl')
    const { preview, createPreview } = useFilePreview()
    const onUpload = useCallback(
        async (image: File) => {
            try {
                updateImageFile(
                    await cropModal.pop({
                        imageUrl: URL.createObjectURL(image),
                    }),
                )
            } catch (e) {
                // action cancelled
            }
        },
        [updateImageFile],
    )
    const uploadedImage = product.newImageToUpload
    useEffect(() => {
        if (!uploadedImage) {
            return
        }

        createPreview(uploadedImage)
    }, [uploadedImage, createPreview])
    return (
        <Container id="cover-image">
            <ImageUpload
                setImageToUpload={onUpload}
                originalImage={preview || product.imageUrl}
                dropZoneClassName={'imageUploadDropZone'}
                disabled={!!disabled}
                className={'coverImageUpload'}
                noPreview={true}
            />
            {!isValid && !!message && <Errors overlap>{message}</Errors>}
        </Container>
    )
}
