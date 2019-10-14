// @flow

import { defaultModuleLayout } from '$editor/canvas/state'

export type Bounds = {
    x: number,
    y: number,
    width: number,
    height: number,
}

const defaultLayout = {
    height: Number.parseInt(defaultModuleLayout.height, 10),
    width: Number.parseInt(defaultModuleLayout.width, 10),
}

export const getModuleBounds = (module: any): Bounds => {
    const { layout } = module
    return {
        x: (layout && parseInt(layout.position.left, 10)) || 0,
        y: (layout && parseInt(layout.position.top, 10)) || 0,
        width: (layout && parseInt(layout.width, 10)) || defaultLayout.width,
        height: (layout && parseInt(layout.height, 10)) || defaultLayout.height,
    }
}

export const getBoundsOf = (boundingBoxes: Bounds[]): Bounds => {
    const aabb = boundingBoxes.reduce((b, m) => ({
        minX: Math.min(b.minX, m.x),
        minY: Math.min(b.minY, m.y),
        maxX: Math.max(b.maxX, m.x + m.width),
        maxY: Math.max(b.maxY, m.y + m.height),
    }), {
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity,
    })
    return {
        x: aabb.minX,
        y: aabb.minY,
        width: aabb.maxX - aabb.minX,
        height: aabb.maxY - aabb.minY,
    }
}

const DEFAULT_BOUNDS = {
    x: 0,
    y: 0,
    width: 1680,
    height: 1260,
}

export function getCanvasBounds(canvas: any, defaultBounds: Bounds = DEFAULT_BOUNDS): Bounds {
    defaultBounds = Object.assign({}, DEFAULT_BOUNDS, defaultBounds)
    const bounds = getBoundsOf(canvas.modules.map((m) => getModuleBounds(m)))
    return {
        x: (bounds.x && Number.isFinite(bounds.x)) ? bounds.x : defaultBounds.x,
        y: (bounds.y && Number.isFinite(bounds.y)) ? bounds.y : defaultBounds.y,
        width: (bounds.width && Number.isFinite(bounds.width)) ? bounds.width : defaultBounds.width,
        height: (bounds.height && Number.isFinite(bounds.height)) ? bounds.height : defaultBounds.height,
    }
}

export const doBoxesIntersect = (a: Bounds, b: Bounds): boolean => (
    ((Math.abs(a.x - b.x) * 2) < (a.width + b.width)) &&
    ((Math.abs(a.y - b.y) * 2) < (a.height + b.height))
)

const dist = (a: Bounds, b: Bounds): number => (
    Math.sqrt(((b.x - a.x) ** 2) + ((b.y - a.y) ** 2))
)

export const findNonOverlappingPosition = (
    currentBB: Bounds,
    boundingBoxes: Bounds[],
    stackOffset: number,
    initial: boolean = true,
): Bounds => {
    // always sort based on passed in bounding box
    boundingBoxes.sort((a, b) => {
        const distA = dist(a, currentBB)
        const distB = dist(b, currentBB)
        return distA - distB
    })

    // only consider boxes to the right/bottom of first box,
    // within an allowance of stackOffset
    const possibleBoxes = initial ? boundingBoxes.filter((bb) => (
        currentBB.x - bb.x <= stackOffset &&
        currentBB.y - bb.y <= stackOffset
    )) : boundingBoxes

    const closest = possibleBoxes[0]

    // no items
    if (!closest) { return currentBB }

    function toStackBB(bb) {
        return {
            ...bb,
            width: stackOffset,
            height: stackOffset,
        }
    }

    const isOverlapping = initial
        ? doBoxesIntersect(closest, currentBB) // use full module sizes for first check
        : doBoxesIntersect(toStackBB(closest), toStackBB(currentBB)) // otherwise only check overlap in stackOffset increments

    if (!isOverlapping) {
        return currentBB
    }

    const nextBB = {
        ...currentBB,
        x: closest.x + stackOffset,
        y: closest.y + stackOffset,
    }

    return findNonOverlappingPosition(nextBB, boundingBoxes, stackOffset, false)
}
