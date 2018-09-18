// @flow

import React, { type Node } from 'react'
import ReactModal2 from 'react-modal2'
import { Translate } from 'streamr-layout/dist/bundle'

import BodyClass, { NO_SCROLL } from '../../../BodyClass/index'
import styles from './filterModal.pcss'

type Props = {
    title: Node,
    children: Node,
    onClear: () => void,
    onClose: () => void,
}

const FilterModal = ({ title, children, onClear, onClose }: Props) => (
    <ReactModal2
        onClose={onClose}
        modalClassName={styles.filterModal}
    >
        <BodyClass className={NO_SCROLL} />
        <div className={styles.modalContainer}>
            <div className={styles.header}>
                <a href="#" className={styles.closeButton} onClick={onClose}>
                    <span className="icon-cross" />
                </a>
                <span className={styles.title}>
                    {title}
                </span>
                <a
                    href="#"
                    className={styles.clearButton}
                    onClick={() => {
                        onClear()
                        onClose()
                    }}
                >
                    <Translate value="actionBar.clear" />
                </a>
            </div>
            <div className={styles.body}>
                {children}
            </div>
        </div>
    </ReactModal2>
)

export default FilterModal
