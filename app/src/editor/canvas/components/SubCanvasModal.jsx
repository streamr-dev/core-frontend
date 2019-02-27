import React from 'react'

import Modal from '$editor/shared/components/Modal'
import Dialog from '$shared/components/Dialog'
import SubCanvas from '$editor/canvas/SubCanvas'

import styles from './SubCanvasModal.pcss'

const SubCanvasDialog = (props) => {
    const { isOpen, modalApi, canvas, canvasData } = props
    console.log(modalApi, canvasData)
    if (!isOpen || !canvas) { return null }
    return (
        <React.Fragment>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div hidden={!isOpen}>
                <Dialog
                    className={styles.dialog}
                    contentClassName={styles.dialogContent}
                    containerClassname={styles.dialogContainer}
                    onClose={() => modalApi.close()}
                    actions={{
                        close: {
                            title: 'Close',
                            onClick: () => modalApi.close(),
                        },
                    }}
                >
                    <SubCanvas
                        canvas={canvas}
                        moduleHash={canvasData.moduleHash}
                        subCanvasKey={canvasData.subCanvasKey}
                    />
                </Dialog>
            </div>
        </React.Fragment>
    )
}

export default (props) => (
    <Modal modalId="SubCanvasDialog">
        {({ api, value }) => (
            <SubCanvasDialog
                isOpen={!!value}
                modalApi={api}
                canvasData={value}
                {...props}
            />
        )}
    </Modal>
)
