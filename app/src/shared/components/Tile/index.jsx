// @flow

import React, { type Element } from 'react'
import { Link } from 'react-router-dom'

import { withHover } from '$mp/components/WithHover'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'

import styles from './tile.pcss'

type Props = {
    children: Array<Element<any>>,
    link: string,
    imageUrl: string,
    isHovered: boolean,
    dropdownActions?: Array<typeof DropdownActions.Item>,
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
            <img src={imageUrl} alt="Tile" />
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

export default withHover(Tile)
