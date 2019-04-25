// @flow

import React, { type Node } from 'react'
import { Collapse } from 'reactstrap'

import SvgIcon from '$shared/components/SvgIcon'
import styles from './sidebar.pcss'

type Props = {
    label: string,
    initialIsOpen?: boolean,
    children?: Node,
}

type State = {
    isOpen: boolean,
}

class Section extends React.Component<Props, State> {
    state = {
        isOpen: !!this.props.initialIsOpen,
    }

    open = (isOpen: boolean = true) => {
        this.setState({
            isOpen,
        })
    }

    render() {
        const { isOpen } = this.state
        const { children, label } = this.props
        return (
            <div className={styles.sidebarSection}>
                <button
                    className={styles.accordionToggle}
                    type="button"
                    onClick={() => this.open(!isOpen)}
                >
                    <span className={styles.accordionLabel}>{label}</span>
                    <SvgIcon name={isOpen ? 'minus' : 'plus'} />
                </button>
                <Collapse isOpen={isOpen}>
                    <div className={styles.sidebarSectionContent}>
                        {children}
                    </div>
                </Collapse>
            </div>
        )
    }
}

export default Section
