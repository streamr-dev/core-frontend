// @flow

import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { MenuItem } from '$shared/components/Tile/Menu'
import useCopy from '$shared/hooks/useCopy'
import routes from '$routes'

// wrap link to avoid validation error in MenuItem
const MenuLink = (props) => (
    <Link {...props} />
)

export const Edit = ({ id }: any) => (
    <MenuItem
        tag={MenuLink}
        to={routes.products.edit({
            id,
        })}
    >
        Edit
    </MenuItem>
)

export const View = ({ id, disabled }: any) => {
    const onClick = useCallback(() => {
        window.open(routes.marketplace.product({
            id,
        }), '_blank', 'noopener noreferrer')
    }, [id])

    return (
        <MenuItem
            disabled={disabled}
            onClick={onClick}
        >
            View product
        </MenuItem>
    )
}

export const ViewStats = ({ id }: any) => (
    <MenuItem
        tag={MenuLink}
        to={routes.products.stats({
            id,
        })}
    >
        View stats
    </MenuItem>
)

export const ViewDataUnion = ({ id }: any) => (
    <MenuItem
        tag={MenuLink}
        to={routes.products.members({
            id,
        })}
    >
        View members
    </MenuItem>
)

export const Copy = ({ id, disabled }: any) => {
    const { copy } = useCopy()

    const onClick = useCallback(() => {
        copy(routes.marketplace.public.product({
            id,
        }))
    }, [copy, id])

    return (
        <MenuItem
            onClick={onClick}
            disabled={disabled}
        >
            Copy URL
        </MenuItem>
    )
}

export const CopyContractAddress = ({ disabled, address }: any) => {
    const { copy } = useCopy()

    const onClick = useCallback(() => {
        copy(address)
    }, [copy, address])

    return (
        <MenuItem
            onClick={onClick}
            disabled={disabled}
        >
            Copy ETH address
        </MenuItem>
    )
}
