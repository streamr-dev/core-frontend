// @flow

import React, { type Node } from 'react'
import { Link } from 'react-router-dom'

import { withHover } from '$shared/components/WithHover'
import FallbackImage from '$shared/components/FallbackImage'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'

import * as subcomponents from './subcomponents'
import styles from './tile.pcss'

type Props = {
    children: Node,
    image?: Node,
    link: string,
    imageUrl?: string,
    isHovered?: boolean,
    dropdownActions?: Array<typeof DropdownActions.Item> | Node,
    onMenuToggle?: (boolean) => void,
}

const Tile = ({
    link,
    image,
    imageUrl,
    children,
    isHovered,
    dropdownActions,
    onMenuToggle,
}: Props) => (
    <Link className={styles.tile} to={link}>
        {isHovered && dropdownActions &&
            <DropdownActions
                className={styles.menu}
                title={<Meatball alt="Select" white />}
                noCaret
                onMenuToggle={onMenuToggle}
            >
                {dropdownActions}
            </DropdownActions>
        }
        <div className={styles.image}>
            {image || (
                <FallbackImage src={imageUrl || ''} alt="Tile" className={styles.image} />
            )}
        </div>
        <div className={styles.content}>
            {children}
        </div>
    </Link>
)

// Add subcomonents as static properties
Object.assign(Tile, {
    ...subcomponents,
})

export default withHover(Tile)
