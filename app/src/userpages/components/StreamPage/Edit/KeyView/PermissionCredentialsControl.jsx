// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import PermissionKeyField from '$userpages/components/PermissionKeyField'
import type { ResourceKey } from '$shared/flowtype/resource-key-types'
import Button from '$shared/components/Button'

type Props = {
    keys: Array<ResourceKey>,
    className?: string,
}

const Root = styled.div`
`

const ListWrapper = styled.div`
`

const ListItem = styled(PermissionKeyField)`
    & + & {
        margin-top: 1.5rem;
    }
`

const AddKeyWrapper = styled.div`
    margin-top: 2rem;
`

export const PermissionCredentialsControl = ({ keys, className }: Props) => (
    <Root className={className}>
        <ListWrapper>
            {keys.map((key: ResourceKey, index: number) => (
                <ListItem
                    key={key.id}
                    keyName={key.name}
                    value={key.id}
                    hideValue
                    allowEdit={false}
                    allowDelete={false}
                    disableDelete
                    showPermissionHeader={!index}
                    permission={key.permission}
                />
            ))}
        </ListWrapper>
        <AddKeyWrapper>
            <Button kind="secondary" disabled>
                {I18n.t('userpages.profilePage.apiCredentials.addAPIKey')}
            </Button>
        </AddKeyWrapper>
    </Root>
)

export default PermissionCredentialsControl
