// @flow

import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'
import links from '../../../links'
import routes from '$routes'
import { formatPath, formatExternalUrl } from '$shared/utils/url'
import { MenuItem } from '$shared/components/Tile2/Menu'
import { productStates } from '$shared/utils/constants'
import useCopy from '$shared/hooks/useCopy'

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

export const PublishUnpublish = ({ id, state }: any) => !process.env.NEW_MP_CONTRACT && (
    (state === productStates.DEPLOYED || state === productStates.NOT_DEPLOYED) && (
        <MenuItem tag={Link} to={formatPath(links.marketplace.products, id, 'publish')}>
            {(
                state === productStates.DEPLOYED ? (
                    <Translate value="actionsDropdown.unpublish" />
                ) : (
                    <Translate value="actionsDropdown.publish" />
                )
            )}
        </MenuItem>
    )
)

export const View = ({ id, disabled }: any) => {
    if (!process.env.NEW_MP_CONTRACT) {
        return null
    }

    if (disabled) {
        return (
            <MenuItem disabled>
                <Translate value="actionsDropdown.viewProduct" />
            </MenuItem>
        )
    }

    return (
        <MenuItem
            href={formatPath(links.marketplace.products, id)}
            rel="noopener noreferrer"
            tag={Link}
            target="_blank"
        >
            <Translate value="actionsDropdown.viewProduct" />
        </MenuItem>
    )
}

export const ViewStats = ({ id, isDataUnion }: any) => (
    !!process.env.DATA_UNIONS && isDataUnion && (
        <MenuItem
            tag={Link}
            to={routes.productStats({
                id,
            })}
        >
            <Translate value="actionsDropdown.viewStats" />
        </MenuItem>
    )
)

export const ViewDataUnion = ({ id, isDataUnion }: any) => (
    !!process.env.DATA_UNIONS && isDataUnion && (
        <MenuItem
            tag={Link}
            to={routes.productMembers({
                id,
            })}
        >
            <Translate value="actionsDropdown.viewDataUnion" />
        </MenuItem>
    )
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
