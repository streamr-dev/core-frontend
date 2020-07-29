// @flow

import React, { type Node, useState, useCallback } from 'react'
import { SortableContainer, type SortableContainerProps } from 'react-sortable-hoc'
import cx from 'classnames'
import styled from 'styled-components'
import BodyClass from '$shared/components/BodyClass'
import SortableItem from './SortableItem'
import styles from './SortableList.pcss'

export type SortProps = {
    oldIndex: number,
    newIndex: number,
}

type Props = {
    children: Node,
    disabled?: boolean,
}

const UnstyledSortableList = ({ children, disabled, ...props }: Props) => {
    const len = React.Children.count(children)

    return (
        <div {...props}>
            {React.Children.map(children, (child, index) => (
                <SortableItem
                    index={index}
                    disabled={disabled}
                    style={{
                        zIndex: len - index,
                    }}
                >
                    {child}
                </SortableItem>
            ))}
        </div>
    )
}

const SortableList = styled(UnstyledSortableList)`
    position: relative;
    z-index: 0;
`

const Sortable = SortableContainer(SortableList)

export default function ({ onSortStart: onSortStartProp, onSortEnd: onSortEndProp, ...props }: SortableContainerProps) {
    // wrap onSort{Start,End} with setSorting flag setter
    const [isSorting, setSorting] = useState(false)
    const onSortStart = useCallback((...args) => {
        setSorting(true)
        if (typeof onSortStartProp !== 'function') { return undefined }
        return onSortStartProp(...args)
    }, [onSortStartProp])
    const onSortEnd = useCallback((...args) => {
        setSorting(false)
        if (typeof onSortEndProp !== 'function') { return undefined }
        return onSortEndProp(...args)
    }, [onSortEndProp])
    return (
        <React.Fragment>
            <BodyClass
                className={cx({
                    [styles.isSorting]: isSorting, /* disable user-select on body when sorting */
                })}
            />
            <Sortable
                onSortStart={onSortStart}
                onSortEnd={onSortEnd}
                {...props}
            />
        </React.Fragment>
    )
}
