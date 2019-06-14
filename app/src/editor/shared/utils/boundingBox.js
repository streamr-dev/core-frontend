// @flow

type BoundingBox = {
    x: number,
    y: number,
    width: number,
    height: number,
}

export const getModuleBoundingBox = (module: any): BoundingBox => {
    const { layout } = module
    return {
        x: (layout && parseInt(layout.position.left, 10)) || 0,
        y: (layout && parseInt(layout.position.top, 10)) || 0,
        width: (layout && parseInt(layout.width, 10)) || 0,
        height: (layout && parseInt(layout.height, 10)) || 0,
    }
}

export const doBoxesIntersect = (a: BoundingBox, b: BoundingBox): boolean => (
    (Math.abs(a.x - b.x) * 2 < (a.width + b.width)) &&
    (Math.abs(a.y - b.y) * 2 < (a.height + b.height))
)
