import React, { useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'

import SvgIcon from '$shared/components/SvgIcon'
import Handle from '../Handle'
import styles from './fieldItem.pcss'

const Trash = styled.button`
    display: none;
    position: absolute;
    width: 40px;
    height: 40px;
    top: 16px;
    right: 8px;
    border: none;
    background-color: transparent;
    border-radius: 4px;

    & > svg {
        width: 18px;

        > path {
            stroke: #A3A3A3;
        }
    }

    &:hover,
    &:active {
        background-color: #E7E7E7;

        & > svg > path {
            stroke: #323232;
        }
    }
`

function FieldItem({ children, onDelete: onDeleteProp, name }) {
    const onDeleteRef = useRef(onDeleteProp)

    useEffect(() => {
        onDeleteRef.current = onDeleteProp
    }, [onDeleteProp])

    const onDelete = useCallback(() => {
        if (typeof onDeleteRef.current === 'function') {
            onDeleteRef.current(name)
        }
    }, [name])

    return (
        <div className={styles.root}>
            <div className={styles.inner}>
                <Handle className={styles.handle} />
                {children}
                <Trash onClick={onDelete} className={styles.trashIcon} type="button">
                    <SvgIcon name="trash" />
                </Trash>
            </div>
        </div>
    )
}

FieldItem.styles = styles

export default FieldItem
