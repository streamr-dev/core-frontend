// @flow

export default async (): Promise<Function> => (
    (await import(/* webpackChunkName: 'zxcvbn' */ 'zxcvbn')).default
)
