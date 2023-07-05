import React, {
    createContext,
    FunctionComponent,
    ReactNode,
    useCallback,
    useMemo,
    useState,
} from 'react'
import { DataUnionId, DataUnionSecret } from '~/marketplace/types/project-types'
import {
    createSecret,
    deleteSecret,
    editSecret,
    getSecrets,
} from '~/marketplace/modules/dataUnion/services'
import { Secret } from '~/marketplace/modules/dataUnion/types'

export type DataUnionSecretsController = {
    load: (dataUnionId: DataUnionId, chainId: number) => Promise<void>
    secrets: DataUnionSecret[]
    add: (param: {
        dataUnionId: DataUnionId
        name: string
        chainId: number
    }) => Promise<void>
    edit: (param: {
        dataUnionId: DataUnionId
        id: string
        name: string
        chainId: number
    }) => Promise<void>
    remove: (param: {
        dataUnionId: DataUnionId
        id: string
        chainId: number
    }) => Promise<void>
    isLoading: boolean
    isLoaded: boolean
    isSaving: boolean
}

const useDataUnionSecretsControllerImplementation = (): DataUnionSecretsController => {
    const [secrets, setSecrets] = useState<DataUnionSecret[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [isSaving, setIsSaving] = useState<boolean>(false)

    const mapSecretToDataUnionSecret = (secret: Secret): DataUnionSecret => ({
        id: secret.secret,
        secret: secret.secret,
        name: secret.name,
        contractAddress: secret.dataUnion,
    })

    const load = useCallback(
        async (dataUnionId: DataUnionId, chainId: number) => {
            try {
                setIsLoading(true)
                const response = await getSecrets({
                    dataUnionId,
                    chainId,
                })
                const mappedSecrets: DataUnionSecret[] = response.map(
                    mapSecretToDataUnionSecret,
                )
                setSecrets(mappedSecrets)
                setIsLoaded(true)
            } catch (e) {
                console.warn(e)
                throw e
            } finally {
                setIsLoading(false)
            }
        },
        [setSecrets, setIsLoaded, setIsLoading],
    )

    const add = useCallback(
        async ({
            dataUnionId,
            name,
            chainId,
        }: {
            dataUnionId: DataUnionId
            name: string
            chainId: number
        }) => {
            setIsSaving(true)
            try {
                const response = await createSecret({
                    dataUnionId,
                    name,
                    chainId,
                })
                setSecrets((current) => [
                    ...current,
                    mapSecretToDataUnionSecret(response),
                ])
                setIsSaving(false)
            } catch (e) {
                console.warn(e)
                setIsSaving(false)
                throw e
            }
        },
        [setSecrets],
    )

    const edit = useCallback(
        async ({
            dataUnionId,
            id,
            name,
            chainId,
        }: {
            dataUnionId: DataUnionId
            id: string
            name: string
            chainId: number
        }) => {
            setIsSaving(true)
            try {
                const response = await editSecret({
                    dataUnionId,
                    id,
                    name,
                    chainId,
                })
                setSecrets((current) => [
                    ...current,
                    mapSecretToDataUnionSecret(response),
                ])
                setIsSaving(false)
            } catch (e) {
                console.warn(e)
                setIsSaving(false)
                throw e
            }
        },
        [setSecrets],
    )

    const remove = useCallback(
        async ({
            dataUnionId,
            id,
            chainId,
        }: {
            dataUnionId: DataUnionId
            id: string
            chainId: number
        }) => {
            setIsSaving(true)
            try {
                await deleteSecret({
                    dataUnionId,
                    id,
                    chainId,
                })
                setSecrets((current) => current.filter((secret) => secret.id !== id))
                setIsSaving(false)
            } catch (e) {
                console.warn(e)
                setIsSaving(false)
                throw e
            }
        },
        [setSecrets],
    )

    return useMemo(
        () => ({
            load,
            secrets,
            add,
            edit,
            remove,
            isLoading,
            isLoaded,
            isSaving,
        }),
        [load, secrets, add, edit, remove, isLoading, isLoaded, isSaving],
    )
}

export const DataUnionSecretsContext = createContext<DataUnionSecretsController>(
    {} as DataUnionSecretsController,
)

export const DataUnionSecretsContextProvider: FunctionComponent<{
    children: ReactNode
}> = ({ children }) => {
    return (
        <DataUnionSecretsContext.Provider
            value={useDataUnionSecretsControllerImplementation()}
        >
            {children}
        </DataUnionSecretsContext.Provider>
    )
}
