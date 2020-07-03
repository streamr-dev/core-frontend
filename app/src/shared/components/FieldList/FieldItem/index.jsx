// @flow

import React, { type Node } from 'react'
import styled from 'styled-components'

import Handle from '../Handle'
import SvgIcon from '$shared/components/SvgIcon'
import styles from './fieldItem.pcss'

const Trash = styled.button`
    display: none;
    position: absolute;
    width: 40px;
    top: 20px;
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

type Props = {
    children: Node,
    onDelete: () => void,
}

const FieldItem = ({ children, onDelete }: Props) => (
    <div className={styles.root}>
        <div className={styles.inner}>
            <Handle className={styles.handle} />
            {children}
            <Trash onClick={onDelete} className={styles.trashIcon}>
                <SvgIcon name="trash" />
            </Trash>
        </div>
    </div>
)

FieldItem.styles = styles

export default FieldItem
