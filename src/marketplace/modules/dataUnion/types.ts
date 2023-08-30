import { PayloadAction } from '~/shared/types/common-types'
import { DataUnionSecretId } from '~/marketplace/types/project-types'
export type DataUnionIdAction = PayloadAction<{
    id: string
}>
export type DataUnionIdsAction = PayloadAction<{
    ids: Array<string>
}>

export type Secret = {
    chain: string
    dataUnion: string
    name: string
    secret: string
}
export type DataUnionSecretsAction = PayloadAction<{
    id: string
    secrets: Array<DataUnionSecretId>
}>
export type DataUnionSecretsActionCreator = (
    id: string,
    secrets: Array<DataUnionSecretId>,
) => DataUnionSecretsAction
export type DataUnionSecretAction = PayloadAction<{
    id: string
    secret: DataUnionSecretId
}>
export type DataUnionSecretActionCreator = (
    id: string,
    secret: DataUnionSecretId,
) => DataUnionSecretAction
