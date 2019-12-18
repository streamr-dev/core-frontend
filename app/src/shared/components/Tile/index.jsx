// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import useHover from '$shared/hooks/useHover'
import FallbackImage from '$shared/components/FallbackImage'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'
import Label from '$shared/components/Label'
import Spinner from '$shared/components/Spinner'

import * as subcomponents from './subcomponents'

import styles from './tile.pcss'

type Props = {
    children?: Node,
    image?: ?Node,
    imageUrl?: string,
    dropdownActions?: Array<typeof DropdownActions.Item> | Node,
    onMenuToggle?: (boolean) => any,
    className?: string,
    badges: subcomponents.BadgesType,
    labels: subcomponents.LabelsType,
    deploying?: boolean,
}

const Tile = ({
    imageUrl,
    image,
    children,
    dropdownActions,
    onMenuToggle,
    className,
    badges,
    labels,
    deploying,
}: Props) => {
    const [hoveredRef, isHovered] = useHover()

    return (
        <div className={cx(styles.tile, className)} ref={hoveredRef}>
            <div className={styles.imageWrapper}>
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
                {image || (
                    <FallbackImage src={imageUrl || ''} alt="Tile" className={styles.image} />
                )}
                <subcomponents.Labels topLeft labels={labels} />
                {!deploying && (
                    <subcomponents.Badges bottomRight badges={badges} />
                )}
                {!!deploying && (
                    <Label bottomRight>
                        <span className={styles.deploying}>Deploying</span>
                        <Spinner size="small" color="white" className={styles.deployingSpinner} />
                    </Label>
                )}
            </div>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}

Tile.defaultProps = {
    badges: {},
    labels: {},
    deploying: false,
}

// Add subcomonents as static properties
Object.assign(Tile, {
    ...subcomponents,
})

export default Tile
