import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components'
import { DataUnionSecret } from '$app/src/marketplace/types/project-types'
import Button from '$shared/components/Button'
import Text from '$ui/Text'
import UnstyledLabel from '$ui/Label'
import LightModal from '$app/src/modals/LightModal'
import useDataUnionSecrets from '$mp/modules/dataUnion/hooks/useDataUnionSecrets'

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
    secret?: DataUnionSecret | undefined,
    chainId: number,
    dataUnionId: string,
    onReject?: (reason?: unknown) => void,
    onResolve?: () => void,
}

export const SecretEditor: FunctionComponent<Props> = ({ secret, chainId, dataUnionId, onReject, onResolve }: Props) => {
    const [name, setName] = useState<string>()
    const { add, edit } = useDataUnionSecrets()

    const isNew = secret == null

    return (
        <LightModal title={isNew ? 'Add a shared secret' : 'Edit shared secret'} onReject={onReject}>
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
                                if (isNew) {
                                    await add({
                                        chainId,
                                        dataUnionId,
                                        name,
                                    })
                                } else {
                                    await edit({
                                        id: secret.id,
                                        chainId,
                                        dataUnionId,
                                        name,
                                    })
                                }

                                if (onResolve != null) {
                                    onResolve()
                                }
                            }
                            catch (e) {
                                console.error(e)
                            }
                        }}
                    >
                        {isNew ? 'Add a shared secret' : 'Save'}
                    </Button>
                    <Button
                        kind='link'
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
