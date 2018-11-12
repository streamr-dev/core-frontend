// @flow

import * as React from 'react'
import cx from 'classnames'

import styles from './list.pcss'

type Props = {
    className?: string,
    ordered?: boolean,
    zeroized?: boolean,
}

const List = ({ ordered, zeroized, className, ...props }: Props) => {
    const Tag = ordered ? 'ol' : 'ul'

    return (
        <Tag
            {...props}
            className={cx(className, {
                [styles.zeroized]: zeroized,
            })}
        />
    )
}

export default List
