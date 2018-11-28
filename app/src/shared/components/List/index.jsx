// @flow

import React from 'react'
import cx from 'classnames'

import styles from './list.pcss'

type Props = {
    className?: string,
    ordered?: boolean,
    unstyled?: boolean,
}

const List = ({ unstyled, ordered, className, ...props }: Props) => {
    const Tag = ordered ? 'ol' : 'ul'

    return (
        <Tag
            {...props}
            className={cx(className, {
                [styles.default]: !unstyled,
            })}
        />
    )
}

List.styles = styles

export default List
