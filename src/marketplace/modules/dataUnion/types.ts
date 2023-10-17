import { PayloadAction } from '~/shared/types/common-types'
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
    secrets: Array<string>
}>
export type DataUnionSecretsActionCreator = (
    id: string,
    secrets: Array<string>,
) => DataUnionSecretsAction
export type DataUnionSecretAction = PayloadAction<{
    id: string
    secret: string
}>
export type DataUnionSecretActionCreator = (
    id: string,
    secret: string,
) => DataUnionSecretAction
