// @flow

const RESIZABLE_MODULES = [
    'ChartModule',
    'CommentModule',
    'HeatmapModule',
    'MapModule',
    'LabelModule',
    'TableModule',
    'StreamrTextField',
]

export default ({ jsModule, widget }: any) => (
    RESIZABLE_MODULES.includes(jsModule) || RESIZABLE_MODULES.includes(widget)
)
