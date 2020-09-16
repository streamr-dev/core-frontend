import React, { useCallback, useReducer, useEffect, useMemo } from 'react'
import styled, { css, keyframes } from 'styled-components'
import cx from 'classnames'
import { I18n } from 'react-redux-i18n'
import startCase from 'lodash/startCase'
import RadioButtonGroup from './RadioButtonGroup'
import SvgIcon from '$shared/components/SvgIcon'
import { isFormElement } from '$shared/utils/isEditableElement'
import Tooltip from '$shared/components/Tooltip'
import Checkbox from './Checkbox'
import { Button as LayoutButton } from '@streamr/streamr-layout'
import * as State from './state'
import useMeasure from './useMeasure'
import usePrevious from './hooks/usePrevious'
import styles from './ShareSidebar.pcss'
import { MEDIUM } from '$shared/utils/styled'

const Header = styled.div`
    align-items: center;
    display: flex;

    h4 {
        font-size: inherit;
        line-height: 24px;
        margin: 0;
        min-width: 0;
        overflow: hidden;
        padding: 0;
        text-overflow: ellipsis;
        transition: all 400ms ease;
        user-select: none;
    }

    > div:first-child {
        flex-grow: 1;
    }

    > div:last-child {
        flex-shrink: 0;
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

const UnstyledCollapse = ({ children, open, ...props }) => {
    const previousOpen = !!usePrevious(!!open)

    const justChanged = previousOpen !== open

    const [bind, { height }] = useMeasure()

    const [, forceUpdate] = useReducer((x) => x + 1, 0)

    useEffect(() => {
        if (justChanged) {
            forceUpdate()
        }
    }, [justChanged, forceUpdate])

    const style = useMemo(() => ({
        height,
        opacity: 1,
        transitionDelay: '0s, 250ms, 0s, 250ms',
        visibility: 'visible',
        transform: 'translateY(0)',
    }), [height])

    return (
        <div
            {...props}
            style={open ? style : {}}
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
        transitionDelay: 0s, 250ms, 0s;
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

/**
 * Individual User's Permissions UI
 */

const UnstyledUserPermissions = ({
    resourceType,
    userId,
    userPermissions,
    updatePermission,
    removeUser,
    className,
    onSelect,
    isSelected,
    isCurrentUser,
    error,
}) => {
    const selectedGroupName = State.findPermissionGroupName(resourceType, userPermissions)
    // custom handling:
    // if user edits permissions after clicking a preset, preset will be set to custom (if config doesn't match another preset)
    // when user actively clicks the custom tab, it will use whatever permissions were currently set

    const isCustom = State.isCustom(resourceType, selectedGroupName, userPermissions)

    const permissionGroupOptions = Object.keys(State.getPermissionGroups(resourceType)).filter((name) => name !== 'default')

    const onClick = useCallback((event) => {
        if (isFormElement(event.target)) { return }
        // toggle open state
        if (isSelected) {
            return onSelect()
        }
        onSelect(userId)
    }, [isSelected, onSelect, userId])

    return (
        <div
            className={cx(styles.userPermissions, className, {
                [styles.isSelected]: isSelected,
            })}
            onClick={onClick}
            onKeyDown={() => {}}
            role="button"
            tabIndex="0"
        >
            <Header>
                <div>
                    <h4 title={userId}>
                        {userId}
                        {!!isCurrentUser && ' (You)'}
                    </h4>
                    <Role visible={!isSelected}>
                        {isCustom ? 'Custom' : startCase(selectedGroupName)}
                    </Role>
                </div>
                <div>
                    <Tooltip value="Remove" disabled={isSelected}>
                        <RemoveButton
                            onClick={(e) => {
                                e.stopPropagation()
                                removeUser(userId)
                            }}
                        />
                    </Tooltip>
                </div>
            </Header>
            <Collapse open={isSelected}>
                <RadioButtonGroup
                    name={`UserPermissions${userId}`}
                    options={permissionGroupOptions}
                    onChange={(name) => {
                        updatePermission(userId, State.getPermissionsForGroupName(resourceType, name))
                    }}
                    selectedOption={selectedGroupName}
                    isCustom={isCustom}
                />
                <Checkbox.List>
                    {Object.entries(userPermissions).map(([permission, value]) => (
                        <Checkbox
                            id={`${userId}-${permission}`}
                            key={permission}
                            label={startCase(I18n.t(`share.permissions.${permission}`))}
                            onChange={() => updatePermission(userId, {
                                [permission]: !value,
                            })}
                            value={value}
                        />
                    ))}
                </Checkbox.List>
            </Collapse>
            {error && (
                <div className={styles.errorMessage}>
                    {error.message}
                </div>
            )}
        </div>
    )
    /* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
}

const UserPermissions = styled(UnstyledUserPermissions)`
    border-bottom: 1px solid #efefef;
    outline: 0;
    transition: background-color 200ms;

    :hover {
        background-color: #fdfdfd;
    }

    ${({ isSelected }) => !!isSelected && css`
        background-color: #fdfdfd;
    `}

    ${({ isSelected }) => !isSelected && css`
        :hover ${RemoveButton} {
            opacity: 1;
            transition-delay: 0s;
            visibility: visible;
        }
    `}

    ${Tooltip.Root} {
        display: block;
    }

    ${RadioButtonGroup} {
        padding: 6px 0 24px; /* 8 cause role label is 16. 16 + 8 -> 24 (same on both ends). */
    }
`

export default UserPermissions
