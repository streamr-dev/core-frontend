export const hasKnownHistory = () => process.env.IS_BROWSER && window.history.state !== null
