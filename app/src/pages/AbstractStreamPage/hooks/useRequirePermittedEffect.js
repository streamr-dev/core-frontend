import { useEffect } from 'react'
import OperationNotPermittedError from '$shared/errors/OperationNotPermittedError'
import useStreamPermissions from './useStreamPermissions'

export default function useRequirePermittedEffect(operation) {
    const { [operation]: op } = useStreamPermissions()

    useEffect(() => {
        if (op == null || op) {
            return
        }

        throw new OperationNotPermittedError(operation)
    }, [op, operation])
}
