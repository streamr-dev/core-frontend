// adapted from create-react-app
module.exports = function BabelConfig(api) {
    if (api.caller(({ name }) => name === 'babel-jest')) {
        // magic NODE_ENV to test when using babel-jest
        // e.g. calling jest via npx on command-line
        process.env.NODE_ENV = 'test'
    }
    return {
        presets: [
            [
                '@babel/preset-env',
                api.env('test')
                    ? {
                          useBuiltIns: 'usage',
                          corejs: 3,
                          loose: true,
                          targets: {
                              node: 'current',
                          },
                      }
                    : {
                          useBuiltIns: 'usage',
                          modules: false,
                          corejs: 3,
                          loose: true,
                          exclude: ['transform-typeof-symbol'],
                          targets: [
                              '> 1.5%',
                              'Opera >= 58',
                              'Safari >= 12',
                              'Edge >= 75',
                              'Firefox ESR',
                              'not dead',
                              'not ie <= 11',
                              'not ie_mob <= 11',
                          ],
                      },
            ],
            [
                '@babel/preset-react',
                {
                    development: !api.env('production'),
                    useBuiltIns: true,
                },
            ],
        ],
        plugins: [
            '@babel/plugin-proposal-optional-chaining',
            [
                '@babel/plugin-transform-destructuring',
                {
                    // Use loose mode for performance:
                    // https://github.com/facebook/create-react-app/issues/5602
                    loose: true,
                    selectiveLoose: [
                        'useState',
                        'useEffect',
                        'useContext',
                        'useReducer',
                        'useCallback',
                        'useMemo',
                        'useRef',
                        'useImperativeHandle',
                        'useLayoutEffect',
                        'useDebugValue',
                    ],
                },
            ],
            [
                '@babel/plugin-proposal-class-properties',
                {
                    loose: true,
                },
            ],
            [
                '@babel/plugin-proposal-object-rest-spread',
                {
                    useBuiltIns: true,
                },
            ],
            [
                '@babel/plugin-transform-runtime',
                {
                    corejs: false,
                    helpers: true,
                    regenerator: false,
                    useESModules: api.env(['development', 'production']),
                },
            ],
            '@babel/plugin-syntax-dynamic-import',
            api.env('test') && 'babel-plugin-dynamic-import-node',
            (!process.env.TEST_HOOKS || process.env.TEST_HOOKS === 'off') &&
                './scripts/removeTestAttrs',
        ].filter(Boolean),
    }
}
