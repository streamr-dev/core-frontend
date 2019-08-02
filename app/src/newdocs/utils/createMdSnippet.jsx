export default (helpObj, typeArray) => Object.entries(helpObj).map(([key, value], idx) => {
    let type = typeArray[idx]
    if (type === undefined) {
        type = ''
    } else {
        type = `\`(${typeArray[idx]})\``
    }
    return `- **${key}:** ${type} ${value}`
}).join('\n')
