import { useEffect } from 'react'
import { StreamPermission } from 'streamr-client'
import OperationNotPermittedError from '$shared/errors/OperationNotPermittedError'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
export default function useRequirePermittedEffect(operation: StreamPermission): void {
    const { [operation]: op } = useStreamPermissions()
    useEffect(() => {
        if (op == null || op) {
            return
        }

        throw new OperationNotPermittedError(operation)
    }, [op, operation])
}
