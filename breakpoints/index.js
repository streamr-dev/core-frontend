const xs = (exports.xs = {
    min: null,
    max: 575,
})

const sm = (exports.sm = {
    min: xs.max + 1,
    max: 767,
})

const md = (exports.md = {
    min: sm.max + 1,
    max: 991,
})

const lg = (exports.lg = {
    min: md.max + 1,
    max: 1199,
})

exports.xl = {
    min: lg.max + 1,
    max: null,
}
