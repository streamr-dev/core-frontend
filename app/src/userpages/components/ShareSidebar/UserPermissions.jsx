import React, { useCallback } from 'react'
import cx from 'classnames'
import { I18n } from 'react-redux-i18n'
import { animated } from 'react-spring'
import startCase from 'lodash/startCase'
import RadioButtonGroup from './RadioButtonGroup'
import Checkbox from '$shared/components/Checkbox'
import SvgIcon from '$shared/components/SvgIcon'
import { isFormElement } from '$shared/utils/isEditableElement'
import Button from '$shared/components/Button'
import Tooltip from '$shared/components/Tooltip'
import * as State from './state'
import useSlideIn from './hooks/useSlideIn'
import styles from './ShareSidebar.pcss'

/**
 * Individual User's Permissions UI
 */

export default function UserPermissions({
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
}) {
    const selectedGroupName = State.findPermissionGroupName(resourceType, userPermissions)
    // custom handling:
    // if user edits permissions after clicking a preset, preset will be set to custom (if config doesn't match another preset)
    // when user actively clicks the custom tab, it will use whatever permissions were currently set

    const isCustom = State.isCustom(resourceType, selectedGroupName, userPermissions)

    const [bind, permissionControlsStyle] = useSlideIn({ isVisible: isSelected })

    const permissionGroupOptions = Object.keys(State.getPermissionGroups(resourceType)).filter((name) => name !== 'default')

    const onClick = useCallback((event) => {
        if (isFormElement(event.target)) { return }
        // toggle open state
        if (isSelected) {
            return onSelect()
        }
        onSelect(userId)
    }, [isSelected, onSelect, userId])

    // eslint-disable-next-line max-len
    /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
    return (
        <div
            className={cx(styles.userPermissions, className, {
                [styles.isSelected]: isSelected,
            })}
        >
            <div className={styles.permissionsHeader} onClick={onClick}>
                <div className={styles.permissionsHeaderTitle}>
                    <h4 title={userId}>
                        {userId}
                        {!!isCurrentUser && (' (You)')}
                    </h4>
                    <div
                        className={cx(styles.selectedGroup, {
                            [styles.isCustom]: isCustom,
                        })}
                    >
                        {isCustom ? 'Custom' : startCase(selectedGroupName)}
                    </div>
                </div>
                <div
                    // eslint-disable-next-line react/jsx-curly-brace-presence
                    css={`
                        align-items: center;
                        display: flex;
                    `}
                >
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
            </div>
            <animated.div className={styles.permissionControls} style={permissionControlsStyle}>
                <div {...bind}>
                    <RadioButtonGroup
                        name={`UserPermissions${userId}`}
                        className={cx(styles.groupSelector, {
                            [styles.isSelected]: isSelected,
                        })}
                        options={permissionGroupOptions}
                        onChange={(name) => {
                            updatePermission(userId, State.getPermissionsForGroupName(resourceType, name))
                        }}
                        selectedOption={selectedGroupName}
                        isCustom={isCustom}
                    />
                    <div className={styles.permissionsCheckboxes}>
                        {Object.entries(userPermissions).map(([permission, value]) => (
                            <div key={permission}>
                                <div className={styles.checkboxContainer}>
                                    <Checkbox
                                        className={styles.checkbox}
                                        id={`${userId}-${permission}`}
                                        value={value}
                                        onChange={() => updatePermission(userId, {
                                            [permission]: !value,
                                        })}
                                    />
                                </div>
                                <label htmlFor={`${userId}-${permission}`}>
                                    {startCase(I18n.t(`share.permissions.${permission}`))}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </animated.div>
            {error && (
                <div className={styles.errorMessage}>
                    {error.message}
                </div>
            )}
        </div>
    )
    /* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
}
