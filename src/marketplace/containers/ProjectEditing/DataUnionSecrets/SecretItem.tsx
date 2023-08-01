import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components'
import { DataUnionSecret } from '~/marketplace/types/project-types'
import WithInputActions from '~/components/WithInputActions'
import PopoverItem from '~/shared/components/Popover/PopoverItem'
import Text from '~/shared/components/Ui/Text'
import Label from '~/shared/components/Ui/Label'
import useCopy from '~/shared/hooks/useCopy'
import { COLORS } from '~/shared/utils/styled'

const Container = styled.div`
    padding: 24px;
    background: ${COLORS.inputBackground};
    border-radius: 4px;
`

type Props = {
    secret: DataUnionSecret
    onEdit: (secret: DataUnionSecret) => void
    onDelete: (secret: DataUnionSecret) => void
}

export const SecretItem: FunctionComponent<Props> = ({
    secret,
    onEdit,
    onDelete,
}: Props) => {
    const { copy } = useCopy()
    const elementId = `secret-${secret.id}`
    const [isRevealed, setIsRevealed] = useState(false)

    return (
        <Container>
            <Label htmlFor={elementId}>{secret.name}</Label>
            <WithInputActions
                actions={[
                    <PopoverItem
                        key="reveal"
                        onClick={() => {
                            setIsRevealed((prev) => !prev)
                        }}
                    >
                        {isRevealed ? 'Hide' : 'Reveal'}
                    </PopoverItem>,
                    <PopoverItem
                        key="copy"
                        onClick={() => {
                            copy(secret.secret, {
                                toastMessage: 'Copied',
                            })
                        }}
                    >
                        Copy
                    </PopoverItem>,
                    <PopoverItem key="delete" onClick={() => onDelete(secret)}>
                        Delete
                    </PopoverItem>,
                ]}
            >
                <Text
                    id={elementId}
                    type={isRevealed ? 'text' : 'password'}
                    autoComplete="off"
                    defaultValue={secret.secret || ''}
                    selectAllOnFocus
                    readOnly
                />
            </WithInputActions>
        </Container>
    )
}
