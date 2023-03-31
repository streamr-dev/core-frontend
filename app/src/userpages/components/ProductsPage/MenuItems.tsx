import React, { FunctionComponent, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { MenuItem } from '$shared/components/Tile/Menu'
import useCopy from '$shared/hooks/useCopy'
import routes from '$routes'

// wrap link to avoid validation error in MenuItem
const MenuLink: FunctionComponent = (props: any) => <Link {...props} />

export const Edit: FunctionComponent<{id: string}> = ({ id }: any) => (
    <MenuItem
        tag={MenuLink}
        to={routes.projects.edit({
            id,
        })}
    >
        Edit
    </MenuItem>
)
export const View: FunctionComponent<{id: string, disabled: boolean}> = ({ id, disabled }) => {
    const onClick = useCallback(() => {
        window.open(
            routes.projects.overview({
                id,
            }),
            '_blank',
            'noopener noreferrer',
        )
    }, [id])
    return (
        <MenuItem disabled={disabled} onClick={onClick}>
            View product
        </MenuItem>
    )
}
export const Copy: FunctionComponent<{id: string, disabled: boolean}> = ({ id, disabled }) => {
    const { copy } = useCopy()
    const onClick = useCallback(() => {
        copy(
            routes.projects.public.overview({
                id,
            }),
        )
    }, [copy, id])
    return (
        <MenuItem onClick={onClick} disabled={disabled}>
            Copy URL
        </MenuItem>
    )
}
