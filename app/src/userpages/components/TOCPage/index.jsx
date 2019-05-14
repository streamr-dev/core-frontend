// @flow

import React, { type Node } from 'react'
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

const TOCPage = withRouter(({ children, location: { hash }, title }: Props) => (
    <Row>
        <Col xs={12} sm={12} md={3}>
            <ul className={styles.tocList}>
                {React.Children.map(children, (child) => {
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
                                    className={cx({
                                        [styles.active]: hash.substr(1) === child.props.id,
                                    })}
                                >
                                    {child.props.linkTitle || child.props.title}
                                </a>
                            </li>
                        )
                    }
                })}
            </ul>
        </Col>
        <Col xs={12} sm={12} md={9} >
            {!!title && (<h1 className={styles.pageTitle}>{title}</h1>)}
            {children}
        </Col>
    </Row>
))

TOCPage.Section = TOCSection

export default TOCPage
