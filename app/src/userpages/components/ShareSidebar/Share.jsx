import React, { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import styled, { css, keyframes } from 'styled-components'
import { Button as LayoutButton } from '@streamr/streamr-layout'
import { usePermissionsState, usePermissionsDispatch, UPDATE_PERMISSION, REMOVE_PERMISSION } from '$shared/components/PermissionsProvider'
import * as Groups from '$shared/components/PermissionsProvider/groups'
import Operations from '$shared/components/PermissionsProvider/operations'
import { getOperationKeys, lookup } from '$shared/components/PermissionsProvider/packer'
import { selectUsername } from '$shared/modules/user/selectors'
import Tooltip from '$shared/components/Tooltip'
import SvgIcon from '$shared/components/SvgIcon'
import useMeasure from './hooks/useMeasure'
import { MEDIUM } from '$shared/utils/styled'
import Checkbox from './Checkbox'
import RadioButtonGroup from './RadioButtonGroup'
import { isFormElement } from '$shared/utils/isEditableElement'

const noop = () => {}

const Header = styled.div`
    align-items: center;
    display: flex;

    h4 {
        font-size: inherit;
        line-height: 24px;
        margin: 0;
        overflow: hidden;
        padding: 0;
        text-overflow: ellipsis;
        transition: all 400ms ease;
        user-select: none;
        white-space: nowrap;
    }

    > div:first-child {
        min-width: 0;
        flex-grow: 1;
    }

    > div:last-child {
        flex-shrink: 0;
        margin-left: 16px;
    }
`

const roleAnimation = keyframes`
    from {
        transform: translateY(4px);
    }

    to {
        transform: translateY(0);
    }
`

const Role = styled.div`
    background-color: #efefef;
    border-radius: 2px;
    color: #525252;
    font-size: 10px;
    font-weight: ${MEDIUM};
    line-height: 16px;
    max-width: fit-content;
    opacity: 0;
    padding: 0 4px;
    position: relative;
    transition-delay: 0.2s, 0s, 0s;
    transition-duration: 0.2s;
    transition-property: visibility, opacity;
    user-select: none;
    visibility: hidden;
    will-change: opacity, transform;

    ${({ visible }) => !!visible && css`
        animation-duration: 0.2s;
        animation-fill-mode: forwards;
        animation-name: ${roleAnimation};
        opacity: 1;
        transition: opacity 0.2s;
        visibility: visible;
    `}
`

const UnstyledRemoveButton = (props) => (
    <LayoutButton {...props} type="button">
        <SvgIcon name="trash" />
    </LayoutButton>
)

const RemoveButton = styled(UnstyledRemoveButton)`
    height: 24px;
    opacity: 0;
    transition-delay: 0.2s, 0s, 0s, 0s;
    transition-property: visibility, background-color, border-color, opacity;
    visibility: hidden;
    width: 24px;

    :hover {
        background-color: #f8f8f8;
        border-color: #f8f8f8;
        transition-delay: 0s;
    }

    svg {
        height: 16px;
        width: 16px;
    }
`

const empty = {}

const UnstyledCollapse = ({ children, open, ...props }) => {
    const [bind, { height }] = useMeasure()

    const style = useMemo(() => ({
        height,
    }), [height])

    return (
        <div
            {...props}
            style={open ? style : empty}
        >
            <div {...bind}>
                {children}
            </div>
        </div>
    )
}

const collapseAnimation = keyframes`
    from {
        transform: translateY(-4px);
    }

    to {
        transform: translateY(0);
    }
`

const Collapse = styled(UnstyledCollapse)`
    height: 0;
    opacity: 0;
    overflow: hidden;
    visibility: hidden;
    transition: 200ms;
    transition-property: visibility, opacity, height;
    transition-delay: 200ms, 0s, 0s;
    will-change: opacity, height, transform;

    ${({ open }) => !!open && css`
        animation-delay: 250ms;
        animation-duration: 0.2s;
        animation-fill-mode: forwards;
        animation-name: ${collapseAnimation};
        opacity: 1;
        transition-delay: 0s, 250ms, 0s;
        visibility: visible;
    `}
`

const DismissBox = styled.div`
    height: 70px;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
`

const Root = styled.div`
    ${({ highlight }) => !!highlight && css`
        background-color: #fdfdfd;
    `}

    ${({ highlight }) => !highlight && css`
        :hover ${RemoveButton} {
            opacity: 1;
            transition-delay: 0s;
            visibility: visible;
        }
    `}

`

const UnstyledShare = ({ className, userId, onSelect, selected }) => {
    const { resourceType, changeset, permissions } = usePermissionsState()

    const currentUserId = useSelector(selectUsername)

    const userCombination = changeset[userId] == null ? permissions[userId] : changeset[userId]

    const ownerCombination = Groups[resourceType].owner

    const onClick = useCallback((e) => {
        if (!isFormElement(e.target) && !selected) {
            onSelect(userId)
        }
    }, [selected, onSelect, userId])

    const onDismiss = useCallback(() => {
        onSelect()
    }, [onSelect])

    const dispatch = usePermissionsDispatch()

    const onRemoveClick = useCallback(() => {
        dispatch({
            type: REMOVE_PERMISSION,
            user: userId,
        })
    }, [dispatch, userId])

    const isCustom = false

    const group = 'Undefined'

    const onPermissionChange = useCallback((operationKey, enabled) => {
        const value = Operations[operationKey]

        dispatch({
            type: UPDATE_PERMISSION,
            user: userId,
            // eslint-disable-next-line no-bitwise
            value: (userCombination | value) - (enabled ? 0 : value),
        })
    }, [userId, userCombination, dispatch])

    return (
        <Root
            className={className}
            onClick={onClick}
            onKeyDown={noop}
            role="button"
            tabIndex="0"
            highlight={selected}
        >
            {selected && (
                <DismissBox
                    onClick={onDismiss}
                />
            )}
            <Header>
                <div>
                    <h4 title={userId}>
                        {userId}
                        {currentUserId === userId && ' (You)'}
                    </h4>
                    <Role visible={!selected}>
                        {isCustom ? 'Custom' : group.replace(/^(\w)/, (c) => c.toUpperCase())}
                    </Role>
                </div>
                <div>
                    <Tooltip value="Remove" disabled={selected}>
                        <RemoveButton
                            onClick={onRemoveClick}
                        />
                    </Tooltip>
                </div>
            </Header>
            <Collapse open={selected}>
                <RadioButtonGroup
                    name={`UserPermissions${userId}`}
                    options={[]}
                    onChange={() => {}}
                    selectedOption={group}
                    isCustom={isCustom}
                />
                <Checkbox.List>
                    {getOperationKeys(ownerCombination).map((key) => (
                        <Checkbox
                            id={`${userId}-${key}`}
                            key={key}
                            onChange={onPermissionChange}
                            operationKey={key}
                            value={lookup(userCombination, key)}
                        />
                    ))}
                </Checkbox.List>
            </Collapse>
        </Root>
    )
}

const Share = styled(UnstyledShare)`
    outline: 0;
    position: relative;
    transition: background-color 200ms;

    :hover {
        background-color: #fdfdfd;
    }

    ${Tooltip.Root} {
        display: block;
    }

    ${RadioButtonGroup} {
        padding: 6px 0 24px;
    }
`

export default Share
