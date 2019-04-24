// @flow

const RESIZABLE_MODULES = [
    'ChartModule',
    'CommentModule',
    'CustomModule',
    'GaugeModule',
    'HeatmapModule',
    'MapModule',
    'LabelModule',
    'TableModule',
    'StreamrTextField',
    'GenericModule',
]

export default ({ jsModule, widget }: any) => (
    RESIZABLE_MODULES.includes(jsModule) || RESIZABLE_MODULES.includes(widget)
)
