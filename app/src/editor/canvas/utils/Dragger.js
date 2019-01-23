import raf from 'raf'

export default class Dragger {
    constructor(ref, onStep, onStop) {
        this.ref = ref
        this.isDragging = false
        this.onStep = onStep
        this.onStop = onStop
    }

    update(isDragging, monitor) {
        if (this.isDragging === isDragging) { return }
        this.isDragging = isDragging
        this.monitor = monitor

        if (isDragging) {
            this.start()
        } else {
            this.stop()
        }
    }

    start = () => {
        const { current } = this.ref
        if (!current) { return }
        if (this.started) { return }
        this.el = current
        this.started = true
        raf(this.step)
    }

    stop = () => {
        if (!this.started) { return }
        this.started = false
        this.onStop(this.diff)
    }

    /**
     * Update position diff in RAF loop
     */

    step = () => {
        if (!this.started) { return }
        if (this.monitor.didDrop()) {
            this.stop()
            return
        }

        const diff = this.monitor.getDifferenceFromInitialOffset()
        if (!diff) { return }

        this.diff = diff

        this.onStep(this.diff)
        raf(this.step) // loop
    }
}
