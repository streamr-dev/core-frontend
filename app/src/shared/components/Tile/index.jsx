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
    link: string,
    imageUrl?: string,
    isHovered?: boolean,
    dropdownActions?: Array<typeof DropdownActions.Item> | Node,
    onMenuToggle?: (boolean) => void,
}

const Tile = ({
    link,
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
                direction="down"
                noCaret
                onMenuToggle={onMenuToggle}
                menuProps={{
                    modifiers: {
                        offset: {
                            // Make menu aligned to the right.
                            // See https://popper.js.org/popper-documentation.html#modifiers..offset
                            offset: '-100%p + 100%',
                        },
                    },
                }}
            >
                {dropdownActions}
            </DropdownActions>
        }
        <FallbackImage src={imageUrl || ''} alt="Tile" className={styles.image} />
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
