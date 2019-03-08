// @flow

import React, { Component, type Node } from 'react'
import { Col, Row } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import cx from 'classnames'

import TOCSection from './TOCSection'
import styles from './tocPage.pcss'

type Props = {
    title?: string,
    children: ?Node,
    location: {
        hash: string,
    },
}

class TOCPage extends Component<Props> {
    static Section = TOCSection

    parseMenu = () => React.Children.map(this.props.children, (child) => {
        if (child.type === TOCSection) {
            return (
                <li
                    key={child.props.id}
                    className={cx(styles.tocListItem, {
                        [styles.hideTablet]: child.props.customStyled,
                    })}
                >
                    <a
                        href={`#${child.props.id}`}
                        className={this.props.location.hash.substr(1) === child.props.id ? styles.active : ''}
                    >
                        {child.props.linkTitle || child.props.title}
                    </a>
                </li>
            )
        }
    })

    render() {
        const { title, children } = this.props

        return (
            <Row>
                <Col xs={12} sm={12} md={3} >
                    <ul className={styles.tocList}>
                        {this.parseMenu()}
                    </ul>
                </Col>
                <Col xs={12} sm={12} md={9} >
                    {!!title && (<h1 className={styles.pageTitle}>{title}</h1>)}
                    {children}
                </Col>
            </Row>
        )
    }
}

export default withRouter(TOCPage)
