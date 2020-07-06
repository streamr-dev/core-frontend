// @flow

import React, { useState, useCallback } from 'react'
import copy from 'copy-to-clipboard'
import { Translate, I18n } from 'react-redux-i18n'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import styled from 'styled-components'

import type { ResourcePermission } from '$shared/flowtype/resource-key-types'
import Popover from '$shared/components/Popover'
import Select from '$ui/Select'
import SplitControl from '$userpages/components/SplitControl'
import Label from '$ui/Label'
import WithInputActions from '$shared/components/WithInputActions'
import Text from '$ui/Text'

type Props = {
    keyName: string,
    value?: string,
    className?: string,
    onSave?: (?string, ?string, ?ResourcePermission) => Promise<void>,
    allowDelete?: boolean,
    disableDelete?: boolean,
    onDelete?: () => Promise<void>,
    showPermissionType?: boolean,
    showPermissionHeader?: boolean,
    permission?: ResourcePermission,
}

const permissionOptions = [
    {
        value: 'stream_subscribe',
        label: 'Subscribe',
    },
    {
        value: 'stream_publish',
        label: 'Publish',
    },
]

const Root = styled.div`
    &:not(:first-child) {
        & > .editor {
        margin-top: 1.5rem;
        }
    }
`

const KeyFieldContainer = styled.div`
    position: relative;
`

const StyledLabel = styled(Label)`
    &:empty::after {
        content: ' ';
        white-space: pre;
    }
`

const PermissionKeyField = ({
    keyName,
    value,
    showPermissionHeader,
    permission,
    className,
}: Props) => {
    const [hidden, setHidden] = useState(true)

    const toggleHidden = useCallback(() => {
        setHidden((wasHidden) => !wasHidden)
    }, [])

    const onCopy = useCallback((value) => {
        copy(value)

        Notification.push({
            title: I18n.t('notifications.valueCopied', {
                value: I18n.t('userpages.keyFieldEditor.keyValue.apiKey'),
            }),
            icon: NotificationIcon.CHECKMARK,
        })
    }, [])

    return (
        <Root className={className}>
            <SplitControl>
                <KeyFieldContainer>
                    <Label htmlFor="keyName">
                        {keyName}
                    </Label>
                    <WithInputActions
                        actions={[
                            <Popover.Item key="reveal" onClick={toggleHidden}>
                                <Translate value={`userpages.keyField.${hidden ? 'reveal' : 'conceal'}`} />
                            </Popover.Item>,
                            <Popover.Item key="copy" onClick={() => onCopy(value)}>
                                <Translate value="userpages.keyField.copy" />
                            </Popover.Item>,
                        ]}
                    >
                        <Text
                            value={value}
                            readOnly
                            type={hidden ? 'password' : 'text'}
                        />
                    </WithInputActions>
                </KeyFieldContainer>
                <div>
                    <StyledLabel>
                        {showPermissionHeader && I18n.t('userpages.streams.edit.configure.permission')}
                    </StyledLabel>
                    <Select
                        options={permissionOptions}
                        value={permissionOptions.find((t) => t.value === permission)}
                        disabled
                    />
                </div>
            </SplitControl>
        </Root>
    )
}

export default PermissionKeyField
