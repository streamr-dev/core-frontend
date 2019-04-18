function getNameAndCounter(originalName) {
    originalName = originalName.trim()
    const matches = /(.+?)((\s(\d+))?)?$/g.exec(originalName)
    if (!matches) { return [originalName, 0] }

    const name = matches[1].trim()
    const counter = Math.max(parseInt(matches[4], 10) || 0, 1)
    return [name, counter]
}

function zeroFirst(number) {
    return number < 10 ? `0${number}` : `${number}`
}

function validate(originalName, existingNames) {
    if (typeof originalName !== 'string' || originalName === '') {
        throw new TypeError(`Name must be non-empty string, got: ${originalName} (${typeof originalName})`)
    }
    if (!Array.isArray(existingNames)) {
        throw new TypeError(`existingNames must be array of non-empty strings, got: ${existingNames} (${typeof existingNames})`)
    }

    existingNames.forEach((existingOriginalName, index) => {
        if (typeof existingOriginalName !== 'string') {
            const v = existingOriginalName
            throw new TypeError(`existingNames must be array of non-empty strings, got: ${v} (${typeof v}) at index ${index}`)
        }
        if (existingOriginalName === '') {
            throw new TypeError(`existingNames must be array of non-empty strings. Empty string found at index ${index}`)
        }
    })
}

export function nextUniqueName(originalName, existingNames) {
    validate(originalName, existingNames)

    originalName = originalName.trim()

    const [name, currentCounter] = getNameAndCounter(originalName)

    let highestCounter = 1
    const matchingNames = existingNames.filter((existingOriginalName) => {
        if (existingOriginalName.trim() === name) { return true }
        const [existingName, existingCounter] = getNameAndCounter(existingOriginalName)
        if (existingName !== name) { return false }
        highestCounter = Math.max(highestCounter, existingCounter)
        return true
    })
    if (!matchingNames.length) { return originalName }

    const index = Math.max(highestCounter + 1, currentCounter)

    return `${name} ${zeroFirst(index)}`
}

export function nextUniqueCopyName(originalName, existingNames) {
    if (typeof originalName !== 'string' || originalName === '') {
        throw new TypeError(`Name must be non-empty string, got: ${originalName} (${typeof originalName})`)
    }
    let [name] = getNameAndCounter(originalName)
    const alreadyCopy = name.endsWith(' Copy')
    if (!alreadyCopy) {
        name = `${originalName.trim()} Copy`
    }
    const created = nextUniqueName(name, existingNames)
    if (created === name) {
        return alreadyCopy ? originalName : name
    }
    return created
}
