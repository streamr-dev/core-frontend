import assert from 'assert-diff'
import { mapStateToProps } from '../../../../../components/DashboardPage/Sidebar/CanvasList'

describe('CanvasList', () => {
    describe('mapStateToProps', () => {
        it('must return canvases or an empty list', () => {
            const canvases = [
                {
                    id: '1',
                    name: 'test1',
                },
            ]
            assert.deepStrictEqual(mapStateToProps({
                canvas: {
                    ids: canvases.map((canvas) => canvas.id),
                },
                dashboard: {
                    ids: [],
                    openDashboard: {},
                },
                entities: {
                    dashboards: {},
                    canvases: {
                        '1': canvases[0],
                    },
                },
            }).canvases, canvases)
            assert.deepStrictEqual(mapStateToProps({
                canvas: {
                    ids: [],
                },
                dashboard: {
                    ids: [],
                    openDashboard: {},
                },
                entities: {
                    dashboards: {},
                    canvases: {},
                },
            }).canvases, [])
        })
        it('must show canvases if dashboard is new', () => {
            assert(mapStateToProps({
                canvas: {},
                dashboard: {
                    ids: [1],
                    openDashboard: {
                        id: 1,
                    },
                },
                entities: {
                    dashboards: {
                        '1': {
                            new: true,
                        },
                    },
                },
            }).showCanvases)
        })
        it('must show canvases if dashboards own permissions contain write permission', () => {
            assert(mapStateToProps({
                canvas: {},
                dashboard: {
                    ids: [1],
                    openDashboard: {
                        id: 1,
                    },
                },
                entities: {
                    dashboards: {
                        '1': {
                            ownPermissions: ['write'],
                        },
                    },
                },
            }).showCanvases)
        })
        it('must not show canvases if not permission to write', () => {
            assert(!mapStateToProps({
                canvas: {},
                dashboard: {
                    ids: [1],
                    openDashboard: {
                        id: 1,
                    },
                },
                entities: {
                    dashboards: {
                        '1': {},
                    },
                },
            }).showCanvases)
        })
    })
})
