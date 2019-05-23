// @flow

type Props = {
    width: number,
    height: number,
    minHeight: number,
    minWidth: number,
}

export default ({ width, height, minWidth, minHeight }: Props) => {
    const ratio = Math.max(minWidth / width, minHeight / height)

    return {
        width: Math.round(width * ratio * 100) / 100,
        height: Math.round(height * ratio * 100) / 100,
    }
}
