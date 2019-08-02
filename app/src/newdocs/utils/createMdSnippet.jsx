export default (helpObj, types, defaultValues) => Object.entries(helpObj).map(([key, value], idx) => {
    let type = types[idx]
    let defaultValue = defaultValues[idx]

    if (defaultValue === undefined) {
        defaultValue = ''
    } else if (defaultValue === '') {
        defaultValue = '- Default value: **""**'
    } else {
        defaultValue = `- Default value: **${defaultValues[idx]}**`
    }

    if (type === undefined) {
        type = ''
    } else {
        type = `\`(${types[idx]})\``
    }
    return `- **${key}:** ${type} ${value}
    ${defaultValue}`
}).join('\n')
