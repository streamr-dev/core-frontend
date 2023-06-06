import { useContext } from 'react'
import {
    DataUnionSecretsContext,
    DataUnionSecretsController,
} from '../dataUnionSecretsContext'

function useDataUnionSecrets(): DataUnionSecretsController {
    return useContext(DataUnionSecretsContext)
}

export default useDataUnionSecrets
