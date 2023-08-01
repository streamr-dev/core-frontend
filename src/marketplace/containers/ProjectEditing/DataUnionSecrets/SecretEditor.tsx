import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components'
import { DataUnionSecret } from '~/marketplace/types/project-types'
import Button from '~/shared/components/Button'
import Text from '~/shared/components/Ui/Text'
import UnstyledLabel from '~/shared/components/Ui/Label'
import LightModal from '~/modals/LightModal'

const Container = styled.div`
    display: grid;
    grid-template-rows: auto auto 40px;
    gap: 32px;
    width: 100%;
`

const Label = styled(UnstyledLabel)`
    display: flex;
`

const Buttons = styled.div`
    justify-self: right;
    gap: 32px;
`

type Props = {
    secret?: DataUnionSecret | undefined
    onReject?: (reason?: unknown) => void
    onResolve?: (name: string) => void
}

export const SecretEditor: FunctionComponent<Props> = ({
    secret,
    onReject,
    onResolve,
}: Props) => {
    const [name, setName] = useState<string>('')
    const isNew = secret == null

    return (
        <LightModal
            title={isNew ? 'Add a shared secret' : 'Edit shared secret'}
            onReject={onReject}
        >
            <Container>
                <div>
                    <Label>Secret name</Label>
                    <Text
                        defaultValue={secret?.name}
                        onCommit={(text) => {
                            setName(text)
                        }}
                        placeholder="Enter a secret name"
                        selectAllOnFocus
                    />
                </div>
                <div>
                    <Label>Shared secret</Label>
                    <Text
                        defaultValue={secret?.secret}
                        placeholder="Shared secret will be automatically generated"
                        disabled
                        selectAllOnFocus
                        readOnly
                    />
                </div>
                <Buttons>
                    <Button
                        disabled={name == null || name.length === 0}
                        onClick={async () => {
                            if (name == null || name.length === 0) {
                                return
                            }

                            try {
                                if (onResolve != null) {
                                    onResolve(name)
                                }
                            } catch (e) {
                                console.error(e)
                            }
                        }}
                    >
                        {isNew ? 'Add a shared secret' : 'Save'}
                    </Button>
                    <Button
                        kind="link"
                        onClick={() => {
                            if (onReject != null) {
                                onReject()
                            }
                        }}
                    >
                        Cancel
                    </Button>
                </Buttons>
            </Container>
        </LightModal>
    )
}
