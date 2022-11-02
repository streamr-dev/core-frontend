module.exports = {
    success: () => ({
        type: 'successNotification',
        level: 'success',
    }),
    error: () => ({
        type: 'errorNotification',
        level: 'error',
    }),
}
