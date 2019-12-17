// @flow

import React, { useCallback } from 'react'
import { Translate } from 'react-redux-i18n'

import useCopy from '$shared/hooks/useCopy'

import styles from './copyStreamIdButton.pcss'

const CopyIcon = () => (
    <svg width="14" height="21" xmlns="http://www.w3.org/2000/svg" className={styles.copyIcon}>
        <path
            d="M12.833 7.777h-2.722a.778.778 0 0 0 0 1.556h2.333v9.333H1.556V9.333h2.333a.778.778 0 0 0 0-1.556H1.167C.523 7.777
            0 8.3 0 8.944v10.11c0 .644.523 1.167 1.167 1.167h11.666c.644 0 1.167-.523 1.167-1.166V8.944c0-.644-.523-1.167-1.167-1.167M4.117
            4.438a.777.777 0 0 1 0-1.1l2.332-2.333a.779.779 0 0 1 1.102 0l2.332 2.333a.778.778 0 1 1-1.1 1.1L7.778 3.432v11.345a.778.778
            0 1 1-1.556 0V3.432L5.217 4.438a.777.777 0 0 1-1.1 0"
        />
    </svg>
)

const CopiedIcon = () => (
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" className={styles.copiedIcon}>
        <g transform="translate(-2 -2)" stroke="#0324FF" fill="none">
            <circle cx="12" cy="12" r="9" />
            <path d="M8.1 12.56l2.2 2.4 5.65-5.67" />
        </g>
    </svg>
)

type Props = {
    streamId: string,
    onCopy: () => void,
}

const CopyStreamIdButton = ({ streamId, onCopy: onCopyProp }: Props) => {
    const { isCopied, copy } = useCopy()

    const onCopy = useCallback(() => {
        copy(streamId)
        onCopyProp()
    }, [streamId, copy, onCopyProp])

    return (
        <div // eslint-disable-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            className={styles.copyButton}
            onClick={onCopy}
        >
            {!isCopied && (
                <div className={styles.hoverLabel}>
                    <Translate value="modal.streamLiveData.inspectorSidebar.copyStreamId" />
                </div>
            )}
            {isCopied ? (
                <CopiedIcon />
            ) : (
                <CopyIcon />
            )}
        </div>
    )
}

export default CopyStreamIdButton
