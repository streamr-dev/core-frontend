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
    ((Math.abs(a.x - b.x) * 2) < (a.width + b.width)) &&
    ((Math.abs(a.y - b.y) * 2) < (a.height + b.height))
)

const dist = (a: BoundingBox, b: BoundingBox): number => (
    Math.sqrt(((b.x - a.x) ** 2) + ((b.y - a.y) ** 2))
)

export const findNonOverlappingPosition = (
    currentBB: BoundingBox,
    boundingBoxes: BoundingBox[],
    stackOffset: number,
    initial: boolean = true,
): BoundingBox => {
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
