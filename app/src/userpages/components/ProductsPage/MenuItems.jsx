// @flow

import React, { useCallback } from 'react'
import { formatPath, formatExternalUrl } from '$shared/utils/url'
import { Link } from 'react-router-dom'
import { MenuItem } from '$shared/components/Tile/Menu'
import { Translate } from 'react-redux-i18n'
import routes from '$routes'
import useCopy from '$shared/hooks/useCopy'
import links from '../../../links'

export const Edit = ({ id }: any) => {
    const to = process.env.NEW_MP_CONTRACT ? (
        routes.editProduct({
            id,
        })
    ) : (
        formatPath(links.marketplace.products, id, 'edit')
    )

    return (
        <MenuItem
            tag={Link}
            to={to}
        >
            <Translate value="actionsDropdown.edit" />
        </MenuItem>
    )
}

export const PublishUnpublish = ({ id, deployed }: any) => (
    <MenuItem tag={Link} to={formatPath(links.marketplace.products, id, 'publish')}>
        {deployed ? (
            <Translate value="actionsDropdown.unpublish" />
        ) : (
            <Translate value="actionsDropdown.publish" />
        )}
    </MenuItem>
)

export const View = ({ id, disabled }: any) => {
    const onClick = useCallback(() => {
        window.open(formatPath(links.marketplace.products, id), '_blank', 'noopener noreferrer')
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
        to={routes.productStats({
            id,
        })}
    >
        <Translate value="actionsDropdown.viewStats" />
    </MenuItem>
)

export const ViewDataUnion = ({ id }: any) => (
    <MenuItem
        tag={Link}
        to={routes.productMembers({
            id,
        })}
    >
        <Translate value="actionsDropdown.viewDataUnion" />
    </MenuItem>
)

export const Copy = ({ id, disabled }: any) => {
    const { copy } = useCopy()

    const onClick = useCallback(() => {
        const url = formatExternalUrl(
            process.env.PLATFORM_ORIGIN_URL,
            links.marketplace.products,
            id,
        )

        copy(url)
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
