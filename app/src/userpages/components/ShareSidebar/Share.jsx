import React, { useCallback, useMemo, Fragment, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled, { css, keyframes } from 'styled-components'
import { Button as LayoutButton } from '@streamr/streamr-layout'
import { truncate } from '$shared/utils/text'
import { usePermissionsState, usePermissionsDispatch } from '$shared/components/PermissionsProvider'
import { UPDATE_PERMISSION } from '$shared/components/PermissionsProvider/utils/reducer'
import groups, { NAMES } from '$shared/components/PermissionsProvider/groups'
import identifyGroup from '$shared/components/PermissionsProvider/utils/identifyGroup'
import getOperationKeys from '$shared/components/PermissionsProvider/utils/getOperationKeys'
import lookup from '$shared/components/PermissionsProvider/utils/lookup'
import toOperationId from '$shared/components/PermissionsProvider/utils/toOperationId'
import { selectUsername } from '$shared/modules/user/selectors'
import Tooltip from '$shared/components/Tooltip'
import SvgIcon from '$shared/components/SvgIcon'
import useMeasure from '$shared/hooks/useMeasure'
import { MEDIUM } from '$shared/utils/styled'
import { isFormElement } from '$shared/utils/isEditableElement'
import Sidebar from '$shared/components/Sidebar'
import Checkbox from './Checkbox'
import RadioButtonGroup from './RadioButtonGroup'
import ErrorMessage from './ErrorMessage'

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
    transform: translateY(4px);
    transition-delay: 0.2s, 0s, 0s;
    transition-duration: 0.2s;
    transition-property: visibility, opacity, transform;
    user-select: none;
    visibility: hidden;
    will-change: opacity, transform;

    ${({ visible }) => !!visible && css`
        opacity: 1;
        transform: translateY(0);
        transition-delay: 0s;
        visibility: visible;
    `}
`

const UnstyledRemoveButton = (props) => (
    <LayoutButton {...props} type="button" kind="secondary">
        <SvgIcon name="trash" />
    </LayoutButton>
)

const RemoveButton = styled(UnstyledRemoveButton)`
    height: 24px;
    opacity: 0;
    padding: 0;
    transition-delay: 0.2s, 0s, 0s, 0s;
    transition-property: visibility, background-color, border-color, opacity;
    visibility: hidden;
    width: 24px;
    background-color: transparent;
    border-color: transparent;

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

    ${({ invalid }) => !invalid && css`
        border-bottom: 1px solid #efefef;
    `}

    & + ${ErrorMessage} {
        border-bottom: 1px solid #efefef;
    }
`

const UnstyledShare = ({ className, userId, onSelect, selected }) => {
    const { resourceType, changeset, combinations, errors } = usePermissionsState()

    const selectedOnceRef = useRef(selected)

    if (selected) {
        selectedOnceRef.current = true
    }

    const [hoveredOnce, setHoveredOnce] = useState(false)

    const hoveredOnceRef = useRef(false)

    const onHover = useCallback(() => {
        if (!hoveredOnceRef.current) {
            setHoveredOnce(true)
            hoveredOnceRef.current = true
        }
    }, [])

    const error = errors[userId]

    const currentUserId = useSelector(selectUsername)

    const userCombination = changeset[userId] == null ? combinations[userId] : changeset[userId]

    const ownerCombination = groups[resourceType].owner

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
            type: UPDATE_PERMISSION,
            user: userId,
            value: undefined,
        })
    }, [dispatch, userId])

    const group = useMemo(() => (
        identifyGroup(resourceType, userCombination)
    ), [resourceType, userCombination])

    const isCustom = groups[resourceType][group] !== userCombination

    const onPermissionChange = useCallback((operationKey, enabled) => {
        const value = toOperationId(operationKey)

        dispatch({
            type: UPDATE_PERMISSION,
            user: userId,
            // eslint-disable-next-line no-bitwise
            value: (userCombination | value) - (!enabled * value),
        })
    }, [userId, userCombination, dispatch])

    const onGroupClick = useCallback((name) => {
        dispatch({
            type: UPDATE_PERMISSION,
            user: userId,
            value: groups[resourceType][name.toLowerCase()],
        })
    }, [dispatch, userId, resourceType])

    return (
        <Fragment>
            <Sidebar.Container
                as={Root}
                className={className}
                highlight={selected}
                invalid={!!error}
                onClick={onClick}
                onKeyDown={noop}
                onMouseEnter={onHover}
                role="button"
                tabIndex="0"
            >
                {selected && (
                    <DismissBox onClick={onDismiss} />
                )}
                <Header>
                    <div>
                        <h4 title={userId}>
                            {truncate(userId, {
                                length: 10,
                            })}
                            {currentUserId === userId && ' (You)'}
                        </h4>
                        <Role visible={!selected}>
                            {isCustom ? 'Custom' : group.replace(/^(\w)/, (c) => c.toUpperCase())}
                        </Role>
                    </div>
                    <div>
                        {(hoveredOnce || hoveredOnceRef.current) && (
                            <Tooltip value="Remove" disabled={selected}>
                                <RemoveButton onClick={onRemoveClick} />
                            </Tooltip>
                        )}
                    </div>
                </Header>
                <Collapse open={selected}>
                    {(selected || selectedOnceRef.current) && (
                        <Fragment>
                            <RadioButtonGroup
                                name={`UserPermissions${userId}`}
                                options={NAMES[resourceType]}
                                onChange={onGroupClick}
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
                        </Fragment>
                    )}
                </Collapse>
            </Sidebar.Container>
            {error && (
                <Sidebar.Container as={ErrorMessage}>
                    {error.message}
                </Sidebar.Container>
            )}
        </Fragment>
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

export default React.memo(Share)
