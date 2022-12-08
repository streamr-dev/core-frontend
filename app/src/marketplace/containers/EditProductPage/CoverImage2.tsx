import React, { useContext, useCallback, useEffect } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import docsLinks from '$shared/../docsLinks'
import ImageUpload from '$shared/components/ImageUpload'
import Errors from '$ui/Errors'
import useModal from '$shared/hooks/useModal'
import useFilePreview from '$shared/hooks/useFilePreview'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import { COLORS, LAPTOP } from '$shared/utils/styled'
import { ProjectHeroImageStyles } from '$mp/containers/ProjectPage/Hero/ProjectHero2.styles'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import useValidation from '../ProductController/useValidation'
import { Context as EditControllerContext } from './EditControllerProvider'
import styles from './coverImage.pcss'
type Props = {
    disabled?: boolean
}

const Container = styled.div`
  ${ProjectHeroImageStyles};
  @media(${LAPTOP}) {
    width: 366px;
  }
  img {
    margin-bottom: 50px;
  }
  
  .coverImageUpload {
    background-color: ${COLORS.primaryLight};
    border-radius: 16px;
    min-height: unset;
    height: auto;
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

export const CoverImage2 = ({ disabled }: Props) => {
    const { state: product } = useEditableState()
    const { updateImageFile } = useEditableProductActions()
    const { isValid, message } = useValidation('imageUrl')
    const { api: cropImageDialog, isOpen } = useModal('cropImage')
    const { preview, createPreview } = useFilePreview()
    const { publishAttempted } = useContext(EditControllerContext)
    const onUpload = useCallback(
        async (image: File) => {
            const newImage = await cropImageDialog.open({
                image,
            })

            if (newImage) {
                updateImageFile(newImage)
            }
        },
        [cropImageDialog, updateImageFile],
    )
    const uploadedImage = product.newImageToUpload
    useEffect(() => {
        if (!uploadedImage) {
            return
        }

        createPreview(uploadedImage)
    }, [uploadedImage, createPreview])
    const hasError = publishAttempted && !isValid
    return (
        <Container id="cover-image">
            <ImageUpload
                setImageToUpload={onUpload}
                originalImage={preview || product.imageUrl}
                dropZoneClassName={'imageUploadDropZone'}
                disabled={!!disabled || isOpen}
                noPreview
                className={'coverImageUpload'}
            />
            {hasError && !!message && <Errors overlap>{message}</Errors>}
        </Container>
    )
}

