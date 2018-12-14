// @flow

import React, { Fragment, Component, type Node } from 'react'
import { Col, Row } from 'reactstrap'

import TOCSection from './TOCSection'
import styles from './tocPage.pcss'

type Props = {
    title?: string,
    children: ?Node,
}

class TOCPage extends Component<Props> {
    static Section = TOCSection

    parseMenu = () => React.Children.map(this.props.children, (child) => {
        if (child.type === TOCSection) {
            return (
                <li key={child.props.id} className={styles.tocListItem}>
                    <a href={`#${child.props.id}`}>{child.props.linkTitle || child.props.title}</a>
                </li>
            )
        }
    })

    render() {
        const { title, children } = this.props

        return (
            <Fragment>
                {!!title && (
                    <Row>
                        <Col
                            xs={12}
                            sm={{
                                size: 9,
                                offset: 3,
                            }}
                        >
                            <h1 className={styles.pageTitle}>{title}</h1>
                        </Col>
                    </Row>
                )}
                <Row>
                    <Col xs={12} sm={4} md={3}>
                        <ul className={styles.tocList}>
                            {this.parseMenu()}
                        </ul>
                    </Col>
                    <Col className="testest" xs={12} sm={8} md={9}>
                        {children}
                    </Col>
                </Row>
            </Fragment>
        )
    }
}

export default TOCPage
