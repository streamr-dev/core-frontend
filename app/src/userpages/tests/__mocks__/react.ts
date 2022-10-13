import React from 'react'

// TODO tests - delete or uncomment if not needed
// Resolution for requestAnimationFrame not supported in jest error :
// https://github.com/facebook/react/issues/9102#issuecomment-283873039
// global.window = global

window.addEventListener = () => {}

// TODO tests - delete or uncomment if not needed
/*
window.requestAnimationFrame = () => {
    throw new Error('requestAnimationFrame is not supported in Node')
}
*/

module.exports = React
