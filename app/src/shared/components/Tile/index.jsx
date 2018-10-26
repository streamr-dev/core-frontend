// @flow

import React, { type Node } from 'react'
import { Link } from 'react-router-dom'

import { withHover } from '$shared/components/WithHover'
import FallbackImage from '$mp/components/FallbackImage'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'

import * as subcomponents from './subcomponents'
import styles from './tile.pcss'

type Props = {
    children: Node,
    link: string,
    imageUrl?: string,
    isHovered?: boolean,
    dropdownActions?: Array<typeof DropdownActions.Item> | Node,
}

const Tile = ({
    link,
    imageUrl,
    children,
    isHovered,
    dropdownActions,
}: Props) => (
    <Link className={styles.tile} to={link}>
        <div className={styles.image}>
            <FallbackImage src={imageUrl || ''} alt="Tile" />
            {isHovered && dropdownActions &&
                <DropdownActions
                    className={styles.menu}
                    title={<Meatball alt="Select" white />}
                    noCaret
                >
                    {dropdownActions}
                </DropdownActions>
            }
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
