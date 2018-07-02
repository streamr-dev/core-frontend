import MESSAGES from '../i18n/messages.properties'

const warned = {}

export default function message(code) {
    const m = MESSAGES[code]
    if (m == null) {
        // print warning once if missing message
        if (warned[code]) {
            return code
        }
        console.warn(`Missing message: ${code}`)
        warned[code] = true
        return code
    }

    return m
}
