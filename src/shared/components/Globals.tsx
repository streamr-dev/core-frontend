import { useInfoToastEffect } from '~/hooks'
import { useSetSentryScopeEffect } from '~/utils/sentry'

export default function Globals() {
    useInfoToastEffect()

    useSetSentryScopeEffect()

    return null
}
