// @flow

import React, { type Node } from 'react'
import { useLocation } from 'react-router-dom'
import cx from 'classnames'

import TOCSection from './TOCSection'
import styles from './tocPage.pcss'

type Props = {
    title?: string,
    children: ?Node,
    className?: string,
}

const TOCPage = ({ children, title, className }: Props) => {
    const { hash } = useLocation()

    return (
        <div className={cx(styles.root, className)}>
            {!!title && (
                <React.Fragment>
                    <div className={styles.pageTitle} />
                    <h1 className={styles.pageTitle}>{title}</h1>
                </React.Fragment>
            )}
            <div>
                <ul className={styles.tocList}>
                    {React.Children.map(children, (child) => (
                        child.type === TOCSection ? (
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
                        ) : null
                    ))}
                </ul>
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}

TOCPage.Section = TOCSection

export default TOCPage
