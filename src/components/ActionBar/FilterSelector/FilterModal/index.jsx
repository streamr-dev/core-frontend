// @flow

import React, { type Node } from 'react'
import ReactModal2 from 'react-modal2'

import { disableScroll, enableScroll } from '../../../../utils/scroll'
import styles from './filterModal.pcss'

type Props = {
    title: Node,
    children: Node,
    onClear: () => void,
    onClose: () => void,
}

class FilterModal extends React.Component<Props> {
    componentDidMount() {
        disableScroll()
    }

    componentWillUnmount() {
        enableScroll()
    }

    render() {
        const { title, children, onClear, onClose } = this.props
        return (
            <ReactModal2
                onClose={onClose}
                modalClassName={styles.filterModal}
            >
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
                            Clear
                        </a>
                    </div>
                    <div className={styles.body}>
                        {children}
                    </div>
                </div>
            </ReactModal2>
        )
    }
}

export default FilterModal
