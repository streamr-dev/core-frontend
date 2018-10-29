import assert from 'assert-diff'
import { parseDashboard } from '../../helpers/parseState'

describe('parseState', () => {
    describe('parseDashboard', () => {
        it('must return open dashboard', () => {
            assert.deepStrictEqual(parseDashboard({
                dashboard: {
                    ids: [1],
                    openDashboard: {
                        id: 1,
                    },
                },
                entities: {
                    dashboards: {
                        '1': {
                            moi: 23,
                        },
                    },
                },
            }).dashboard, {
                moi: 23,
            })
        })
        it('must return undefined if no dashboard is open', () => {
            assert.deepStrictEqual(parseDashboard({
                dashboard: {
                    ids: [1],
                    openDashboard: {
                        id: 2,
                    },
                },
                entities: {
                    dashboards: {
                        '1': {
                            moi: 23,
                        },
                    },
                },
            }).dashboard, undefined)
        })
        describe('on unsaved dashboard', () => {
            it('must set canWrite to true', () => {
                assert.deepStrictEqual(parseDashboard({
                    dashboard: {
                        ids: [1],
                        openDashboard: {
                            id: 1,
                        },
                    },
                    entities: {
                        dashboards: {
                            '1': {
                                moi: 23,
                                new: true,
                                saved: true,
                            },
                        },
                    },
                }).canWrite, true)
            })
            it('must set canShare to false', () => {
                assert.deepStrictEqual(parseDashboard({
                    dashboard: {
                        ids: [1],
                        openDashboard: {
                            id: 1,
                        },
                    },
                    entities: {
                        dashboards: {
                            '1': {
                                moi: 23,
                                new: true,
                                saved: true,
                            },
                        },
                    },
                }).canShare, false)
            })
        })
        describe('on saved dashboard', () => {
            describe('with only read permission', () => {
                it('must set canWrite to false', () => {
                    assert.deepStrictEqual(parseDashboard({
                        dashboard: {
                            ids: [1],
                            openDashboard: {
                                id: 1,
                            },
                        },
                        entities: {
                            dashboards: {
                                '1': {
                                    moi: 23,
                                    new: false,
                                    saved: true,
                                    ownPermissions: ['read'],
                                },
                            },
                        },
                    }).canWrite, false)
                })
                it('must set canShare to false', () => {
                    assert.deepStrictEqual(parseDashboard({
                        dashboard: {
                            ids: [1],
                            openDashboard: {
                                id: 1,
                            },
                        },
                        entities: {
                            dashboards: {
                                '1': {
                                    moi: 23,
                                    new: false,
                                    saved: true,
                                    ownPermissions: ['read'],
                                },
                            },
                        },
                    }).canShare, false)
                })
            })
            describe('with write permission', () => {
                it('must set canWrite to true', () => {
                    assert.deepStrictEqual(parseDashboard({
                        dashboard: {
                            ids: [1],
                            openDashboard: {
                                id: 1,
                            },
                        },
                        entities: {
                            dashboards: {
                                '1': {
                                    moi: 23,
                                    new: false,
                                    saved: true,
                                    ownPermissions: ['write'],
                                },
                            },
                        },
                    }).canWrite, true)
                })
            })
            describe('with share permission', () => {
                it('must set canShare to true', () => {
                    assert.deepStrictEqual(parseDashboard({
                        dashboard: {
                            ids: [1],
                            openDashboard: {
                                id: 1,
                            },
                        },
                        entities: {
                            dashboards: {
                                '1': {
                                    moi: 23,
                                    new: false,
                                    saved: true,
                                    ownPermissions: ['share'],
                                },
                            },
                        },
                    }).canShare, true)
                })
            })
        })
    })
})
