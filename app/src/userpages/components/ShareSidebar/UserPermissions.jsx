import React, { useCallback, useReducer, useEffect, useMemo } from 'react'
import styled, { css } from 'styled-components'
import cx from 'classnames'
import { I18n } from 'react-redux-i18n'
import startCase from 'lodash/startCase'
import RadioButtonGroup from './RadioButtonGroup'
import SvgIcon from '$shared/components/SvgIcon'
import { isFormElement } from '$shared/utils/isEditableElement'
import Button from '$shared/components/Button'
import Tooltip from '$shared/components/Tooltip'
import Checkbox from './Checkbox'
import * as State from './state'
import useSlideIn from './hooks/useSlideIn'
import useMeasure from './useMeasure'
import usePrevious from './hooks/usePrevious'
import styles from './ShareSidebar.pcss'
import { MEDIUM } from '$shared/utils/styled'

const Header = styled.div`
    align-items: center;
    display: flex;

    h4 {
        font-size: inherit;
        line-height: normal;
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

const Role = styled.div`
    background-color: #efefef;
    color: #525252;
    font-size: 10px;
    font-weight: ${MEDIUM};
    line-height: 16px;
    margin-top: 2px;
    max-width: fit-content;
    opacity: 1;
    padding: 0 4px;
    position: relative;
    transform: translateY(0px);
    transition: all 300ms ease;
    visibility: visible;
    will-change: opacity, transform;

    ${({ visible }) => !visible && css`
        opacity: 0;
        transform: translateY(4px);
        visibility: hidden;
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

const Collapse = styled(UnstyledCollapse)`
    height: 0;
    opacity: 0;
    overflow: hidden;
    visibility: hidden;
    transform: translateY(-4px);
    transition: 200ms;
    transition-property: visibility, opacity, height, transform;
    transition-delay: 200ms, 0s, 0s, 0s;
    will-change: opacity, height, transform;
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
        >
            <Header onClick={onClick}>
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
                    <Tooltip value="Remove">
                        <Button
                            kind="secondary"
                            onClick={(event) => {
                                event.stopPropagation()
                                removeUser(userId)
                            }}
                            className={styles.button}
                        >
                            <SvgIcon name="trash" className={styles.trashIcon} />
                        </Button>
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
    ${Tooltip.Root} {
        display: block;
    }

    ${RadioButtonGroup} {
        padding: 6px 0 24px; /* 8 cause role label is 16. 16 + 8 -> 24 (same on both ends). */
    }
`

export default UserPermissions
