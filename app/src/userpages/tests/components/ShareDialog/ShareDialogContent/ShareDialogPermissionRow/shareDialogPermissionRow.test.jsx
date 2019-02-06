import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'

import { ShareDialogPermissionRow, mapStateToProps } from '$userpages/components/ShareDialog/ShareDialogContent/ShareDialogPermissionRow'

describe('ShareDialogPermissionRow', () => {
    describe('render', () => {
        it('renders the permissions correctly', () => {
            const permissions = [{
                field: 1,
                user: 'A',
            }, {
                field: 2,
                user: 'B',
            }, {
                field: 3,
                user: 'C',
            }, {
                field: 4,
                user: 'B',
            }, {
                field: 5,
                user: 'A',
            }, {
                field: 6,
                user: 'A',
            }]
            const permissionRow = shallow(<ShareDialogPermissionRow
                permissions={permissions}
                resourceType="testType"
                resourceId="testId"
            />)
            const rows = permissionRow.find('Connect(ShareDialogPermission)')

            assert.equal(rows.length, 3)
            assert.deepStrictEqual(rows.at(0).props(), {
                permissions: [{
                    field: 1,
                    user: 'A',
                }, {
                    field: 5,
                    user: 'A',
                }, {
                    field: 6,
                    user: 'A',
                }],
                resourceType: 'testType',
                resourceId: 'testId',
            })

            assert.deepStrictEqual(rows.at(1).props(), {
                permissions: [{
                    field: 2,
                    user: 'B',
                }, {
                    field: 4,
                    user: 'B',
                }],
                resourceType: 'testType',
                resourceId: 'testId',
            })

            assert.deepStrictEqual(rows.at(2).props(), {
                permissions: [{
                    field: 3,
                    user: 'C',
                }],
                resourceType: 'testType',
                resourceId: 'testId',
            })
        })
    })

    describe('mapStateToProps', () => {
        describe('when permissions found', () => {
            it('should find the permissions by type and id', () => {
                const byTypeAndId = {
                    type: {
                        id: [{
                            id: 'asdfasdf',
                        }, {
                            id: null,
                            user: 'test2',
                            new: true,
                        }],
                    },
                }
                assert.deepStrictEqual(mapStateToProps({
                    permission: {
                        byTypeAndId,
                    },
                }, {
                    resourceType: 'type',
                    resourceId: 'id',
                }).permissions, [{
                    id: 'asdfasdf',
                }, {
                    id: null,
                    user: 'test2',
                    new: true,
                }])
            })
            it('should filter out removed permissions', () => {
                const byTypeAndId = {
                    type: {
                        id: [{
                            id: 'asdfasdf',
                            removed: true,
                        }, {
                            id: null,
                            user: 'test2',
                            new: true,
                        }, {
                            id: 'aapeli',
                        }],
                    },
                }
                assert.deepStrictEqual(mapStateToProps({
                    permission: {
                        byTypeAndId,
                    },
                }, {
                    resourceType: 'type',
                    resourceId: 'id',
                }).permissions, [{
                    id: null,
                    user: 'test2',
                    new: true,
                }, {
                    id: 'aapeli',
                }])
            })
            it('should filter out anonymous permissions', () => {
                const byTypeAndId = {
                    type: {
                        id: [{
                            id: 'asdfasdf',
                            anonymous: true,
                        }, {
                            id: null,
                            user: 'test2',
                            new: true,
                        }, {
                            id: 'aapeli',
                        }],
                    },
                }
                assert.deepStrictEqual(mapStateToProps({
                    permission: {
                        byTypeAndId,
                    },
                }, {
                    resourceType: 'type',
                    resourceId: 'id',
                }).permissions, [{
                    id: null,
                    user: 'test2',
                    new: true,
                }, {
                    id: 'aapeli',
                }])
            })
            it('should filter out permissions with id: null and new: false', () => {
                const byTypeAndId = {
                    type: {
                        id: [{
                            id: 'asdfasdf',
                            anonymous: false,
                        }, {
                            id: null,
                            new: false,
                        }, {
                            id: 'aapeli',
                        }],
                    },
                }
                assert.deepStrictEqual(mapStateToProps({
                    permission: {
                        byTypeAndId,
                    },
                }, {
                    resourceType: 'type',
                    resourceId: 'id',
                }).permissions, [{
                    id: 'asdfasdf',
                    anonymous: false,
                }, {
                    id: 'aapeli',
                }])
            })
        })
        describe('when no permissions found', () => {
            it('should return empty array if invalid id', () => {
                const byTypeAndId = {
                    type: {
                        id: [],
                    },
                }
                assert.deepStrictEqual(mapStateToProps({
                    permission: {
                        byTypeAndId,
                    },
                }, {
                    resourceType: 'type',
                    resourceId: 'anotherId',
                }), {
                    permissions: [],
                })
            })
            it('should return empty array if invalid type', () => {
                const byTypeAndId = {
                    type: {
                        id: [],
                    },
                }
                assert.deepStrictEqual(mapStateToProps({
                    permission: {
                        byTypeAndId,
                    },
                }, {
                    resourceType: 'anotherType',
                    resourceId: 'anotherId',
                }), {
                    permissions: [],
                })
            })
        })
    })
})
