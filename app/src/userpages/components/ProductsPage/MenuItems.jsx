// @flow

import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { MenuItem } from '$shared/components/Tile/Menu'
import { Translate } from 'react-redux-i18n'
import routes from '$routes'
import useCopy from '$shared/hooks/useCopy'

export const Edit = ({ id }: any) => (
    <MenuItem
        tag={Link}
        to={routes.products.edit({
            id,
        })}
    >
        <Translate value="actionsDropdown.edit" />
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
            <Translate value="actionsDropdown.viewProduct" />
        </MenuItem>
    )
}

export const ViewStats = ({ id }: any) => (
    <MenuItem
        tag={Link}
        to={routes.products.stats({
            id,
        })}
    >
        <Translate value="actionsDropdown.viewStats" />
    </MenuItem>
)

export const ViewDataUnion = ({ id }: any) => (
    <MenuItem
        tag={Link}
        to={routes.products.members({
            id,
        })}
    >
        <Translate value="actionsDropdown.viewDataUnion" />
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
            <Translate value="actionsDropdown.copyUrl" />
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
            <Translate value="actionsDropdown.copyContractAddress" />
        </MenuItem>
    )
}
