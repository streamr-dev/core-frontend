export const createMdSnippet = (helpObj) => Object.entries(helpObj).map(([key, value]) =>
    `- **${key}:** ${value}
    `).join('\n')
