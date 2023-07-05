import { PayloadAction } from '~/shared/types/common-types'
import { DataUnionId, DataUnionSecretId } from '~/marketplace/types/project-types'
export type DataUnionIdAction = PayloadAction<{
    id: DataUnionId
}>
export type DataUnionIdsAction = PayloadAction<{
    ids: Array<DataUnionId>
}>

export type Secret = {
    chain: string
    dataUnion: string
    name: string
    secret: string
}
export type DataUnionSecretsAction = PayloadAction<{
    id: DataUnionId
    secrets: Array<DataUnionSecretId>
}>
export type DataUnionSecretsActionCreator = (
    id: DataUnionId,
    secrets: Array<DataUnionSecretId>,
) => DataUnionSecretsAction
export type DataUnionSecretAction = PayloadAction<{
    id: DataUnionId
    secret: DataUnionSecretId
}>
export type DataUnionSecretActionCreator = (
    id: DataUnionId,
    secret: DataUnionSecretId,
) => DataUnionSecretAction
