import React, { FunctionComponent, useCallback, useState } from 'react'
import styled from 'styled-components'
import { DataUnionSecret } from '$app/src/marketplace/types/project-types'
import WithInputActions from '$shared/components/WithInputActions'
import PopoverItem from '$shared/components/Popover/PopoverItem'
import Text from '$ui/Text'
import Label from '$ui/Label'
import useCopy from '$shared/hooks/useCopy'
import { COLORS } from '$app/src/shared/utils/styled'

const Container = styled.div`
    padding: 24px;
    background: ${COLORS.inputBackground};
    border-radius: 4px;
`

type Props = {
    secret: DataUnionSecret,
    onEdit: (secret: DataUnionSecret) => void,
    onDelete: (secret: DataUnionSecret) => void,
}

export const SecretItem: FunctionComponent<Props> = ({ secret, onEdit, onDelete }: Props) => {
    const { copy } = useCopy()
    const elementId = `secret-${secret.id}`
    const [isRevealed, setIsRevealed] = useState(false)

    const onCopy = useCallback(() => {
        copy(secret.secret, {
            toastMessage: 'Copied',
        })
    }, [copy, secret.secret])

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
                        onClick={onCopy}
                    >
                        Copy
                    </PopoverItem>,
                    <PopoverItem
                        key="delete"
                        onClick={() => onDelete(secret)}
                    >
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
