'use strict'

const { TextEncoder, TextDecoder } = require('util')
const { default: $JSDOMEnvironment, TestEnvironment } = require('jest-environment-jsdom')

Object.defineProperty(exports, '__esModule', {
    value: true,
})

class JSDOMEnvironment extends $JSDOMEnvironment {
    constructor(...args) {
        const { global } = super(...args)

        Object.assign(global, {
            TextEncoder,
            TextDecoder,
            Uint8Array,
        })
    }
}

exports.default = JSDOMEnvironment

exports.TestEnvironment =
    TestEnvironment === $JSDOMEnvironment ? JSDOMEnvironment : TestEnvironment
