import {useContext} from 'react'
import {DataUnionSecretsContext, DataUnionSecretsController} from "../dataUnionSecrectsContext"

function useDataUnionSecrets(): DataUnionSecretsController {
    return useContext(DataUnionSecretsContext)
}

export default useDataUnionSecrets
