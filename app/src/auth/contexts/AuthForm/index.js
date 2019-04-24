// @flow

import React, { type Context } from 'react'

export type Props = {
    errors: Object,
    form: Object,
    isProcessing: boolean,
    next: () => void,
    prev: () => void,
    redirect: () => void,
    setFieldError: (string, string) => void,
    setFormField: (string, any) => void,
    setIsProcessing: (boolean) => void,
    step: number,
}

const defaultContext: Props = {
    errors: {},
    form: {},
    isProcessing: false,
    next: () => {},
    prev: () => {},
    redirect: () => {},
    setFieldError: () => {},
    setFormField: () => {},
    setIsProcessing: () => {},
    step: -1,
}

export default (React.createContext(defaultContext): Context<Props>)
