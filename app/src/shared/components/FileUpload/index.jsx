// @flow

import React, { type Element, useEffect, useState, useCallback, useMemo } from 'react'
import Dropzone from 'react-dropzone'
import cx from 'classnames'

import styles from './fileUpload.pcss'

export type DropzoneFile = File & {
    preview?: string,
}

export const fileUploadErrors = {
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    INVALID_MIME_TYPE: 'INVALID_MIME_TYPE',
}
export type FileUploadError = $Keys<typeof fileUploadErrors>

type Props = {
    component: Element<any>,
    dropTargetComponent: Element<any>,
    dragOverComponent?: Element<any>,
    onFilesAccepted: (Array<File>) => void,
    onError?: (error: FileUploadError) => void,
    acceptMime: Array<string>,
    maxFileSizeInMB: number,
    className?: string,
}

const megabytesToBytes = (mb: number) => mb * 1024 * 1024

// $FlowFixMe shoulbe forwardRef<Props, HTMLDivElement>(...) but flow doesn't recognize forwardRef annotations
const FileUpload = React.forwardRef(({
    onFilesAccepted,
    onError,
    acceptMime,
    maxFileSizeInMB,
    dragOverComponent,
    dropTargetComponent,
    component,
    className,
    ...rest
}: Props, ref: any) => {
    const [isDragOver, setDragOver] = useState(false)
    const [isDragActive, setDragActive] = useState(false)

    useEffect(() => {
        let lastTarget
        const onWindowDragEnter = (event: DragEvent) => {
            lastTarget = event.target
            setDragActive(true)
        }

        const onWindowDragLeave = (event: DragEvent) => {
            if (lastTarget === event.target || event.target === document) {
                setDragActive(false)
                setDragOver(false)
            }
        }

        const onWindowDrop = () => {
            setDragActive(false)
            setDragOver(false)
        }

        window.addEventListener('dragenter', onWindowDragEnter)
        window.addEventListener('dragleave', onWindowDragLeave)
        window.addEventListener('drop', onWindowDrop)

        return () => {
            window.removeEventListener('dragenter', onWindowDragEnter)
            window.removeEventListener('dragleave', onWindowDragLeave)
            window.removeEventListener('drop', onWindowDrop)
        }
    }, [])

    const onDrop = useCallback((files: Array<DropzoneFile>) => {
        if (files && files.length > 0) {
            onFilesAccepted(files)
        }
    }, [onFilesAccepted])

    const onDropRejected = useCallback(([file]: any) => {
        if (onError) {
            if (file.size > megabytesToBytes(maxFileSizeInMB)) {
                onError(fileUploadErrors.FILE_TOO_LARGE)
            }

            if (!acceptMime.includes(file.type)) {
                onError(fileUploadErrors.INVALID_MIME_TYPE)
            }
        }
    }, [onError, acceptMime, maxFileSizeInMB])

    const children = useMemo(() => {
        if (isDragActive && (!isDragOver || dragOverComponent == null)) {
            return dropTargetComponent
        } else if (isDragOver && dragOverComponent != null) {
            return dragOverComponent
        }

        return component
    }, [isDragActive, isDragOver, dropTargetComponent, dragOverComponent, component])

    return (
        <Dropzone
            {...rest}
            onDrop={onDrop}
            onDropRejected={onDropRejected}
            onDragOver={() => setDragOver(true)}
            onDragLeave={() => setDragOver(false)}
            accept={acceptMime.join(', ')}
            maxSize={megabytesToBytes(maxFileSizeInMB)}
            ref={ref}
        >
            {({ getRootProps, getInputProps }) => (
                <div
                    {...getRootProps({
                        className: cx(styles.dropzone, className),
                    })}
                >
                    <input {...getInputProps()} />
                    {children}
                </div>
            )}
        </Dropzone>
    )
})

export default FileUpload
