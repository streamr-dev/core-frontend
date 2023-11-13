import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'
import {
    maxFileSizeForImageUpload,
    maxFileSizeForImageUpload as maxSize,
} from '~/shared/utils/constants'
import useIsMounted from '~/shared/hooks/useIsMounted'
import { errorToast } from '~/utils/toast'

interface ImageFilePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrop'> {
    disabled?: boolean
    onDrop?: <T extends File>(file: T) => void
    onReject?: <T extends File>(file: T) => void
}

export default function ImageFilePicker({
    children,
    disabled = false,
    onDrop,
    onReject,
    ...props
}: ImageFilePickerProps) {
    const isMounted = useIsMounted()

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
        maxSize,
        maxFiles: 1,
        async onDropAccepted([file]) {
            onDrop?.(file)
        },
        onDropRejected([{ file }]) {
            if (onReject) {
                return void onReject(file)
            }

            if (!isMounted()) {
                return
            }

            if (file.size > maxFileSizeForImageUpload) {
                errorToast({
                    title: `Image file size must be less than ${
                        0 | (maxFileSizeForImageUpload / 1e6)
                    }MB`,
                })
            }
        },
        disabled,
    })

    return (
        <ImageFilePickerRoot
            {...getRootProps(props)}
            area-disabled={disabled}
            $isDragActive={isDragActive}
        >
            <input {...getInputProps()} />
            {children}
        </ImageFilePickerRoot>
    )
}

const ImageFilePickerRoot = styled.div<{ $isDragActive?: boolean }>`
    cursor: pointer;
    overflow: hidden;
    position: relative;

    &[area-disabled] {
        opacity: 0.5;
    }
`
